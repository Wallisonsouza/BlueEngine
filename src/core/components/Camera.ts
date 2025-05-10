import Matrix4x4 from "../math/Matrix4x4";
import Ray from "../physics/Ray";
import Component from "./Component";
import Color from "../math/color";
import { NullReferenceException } from "../Error";
import Vector3 from "../math/Vector3";
import Vector4 from "../math/Vector4";
import Display from "./Display";
import SceneManager from "../managers/SceneManager";
import GameObject from "./GameObject";

export default class Camera extends Component {

    public static readonly TYPE = "Camera";
    // Propriedades privadas
    private fieldOfViewData: number;
    private aspectRatioData: number;
    private nearPlaneData: number;
    private farPlaneData: number;
    private projectionMatrixData: Matrix4x4;
    private viewMatrixData: Matrix4x4;

    public depth: boolean;
    public clearColor: Color;

    //#region Getters
    public get fieldOfView(): number {
        return this.fieldOfViewData;
    }

    public get aspectRatio(): number {
        return this.aspectRatioData;
    }

    public get nearPlane(): number {
        return this.nearPlaneData;
    }

    public get farPlane(): number {
        return this.farPlaneData;
    }

    private clearProjectionCache() {
        this.projectionMatrixData = Matrix4x4.createPerspective(
            this.fieldOfViewData,
            this.aspectRatioData,
            this.nearPlaneData,
            this.farPlaneData
        );
    }

    public setGameObject(gameObject: GameObject): void {
        super.setGameObject(gameObject);
        this.transform.onModelMatrixUpdate(() => {
            this.viewMatrixData = this.transform.modelMatrix.inverse();
        })
    }

    //#region Setters
    public set fieldOfView(fov: number) {
        if (this.fieldOfViewData !== fov) {
            this.fieldOfViewData = fov;
            this.clearProjectionCache();
        }
    }

    public set aspectRatio(aspectRatio: number) {
        if (this.aspectRatioData !== aspectRatio) {
            this.aspectRatioData = aspectRatio;
            this.clearProjectionCache();
        }
    }

    public set nearPlane(nearPlane: number) {
        if (this.nearPlaneData !== nearPlane) {
            this.nearPlaneData = nearPlane;
            this.clearProjectionCache();
        }
    }

    public set farPlane(farPlane: number) {
        if (this.farPlaneData !== farPlane) {
            this.farPlaneData = farPlane;
            this.clearProjectionCache();
        }
    }
   
    public static get main(): Camera {

        const cameraObject = SceneManager.getGameObjectByTag("MainCamera");
        if (!cameraObject) {

            const exepction = new NullReferenceException("[Camera]", "Câmera principal não encontrada.");
            Display.addError(exepction);
            throw exepction;
          
        }

        const cameraComponent = cameraObject.getComponentByType<Camera>("Camera");
        if (!cameraComponent) {
            throw new NullReferenceException("[Camera]", "Componente de câmera não encontrado no objeto da câmera principal.");
        }

        return cameraComponent;
    }

    constructor() {
        super("Camera", "Camera");
        this.fieldOfViewData = 60;
        this.aspectRatioData = 16 / 9;
        this.nearPlaneData = 0.03;
        this.farPlaneData = 300;
        this.projectionMatrixData = Matrix4x4.identity;
        this.viewMatrixData = Matrix4x4.identity;
        this.clearColor = Color.CHARCOAL;
        this.depth = true;
    }
    
    public get projectionMatrix(): Matrix4x4 {
        return this.projectionMatrixData;
    }

    public get viewMatrix() {
        return this.viewMatrixData;
    }

    public get viewProjectionMatrix(): Matrix4x4 {
        return this.viewMatrix.multiply(this.projectionMatrix);
    }

    screenPointToRay(screenPoint: Vector3): Ray {
        // Passo 1: Converter o ponto da tela para coordenadas NDC (origem no centro da tela)
        const clipCoords = Display.screenToNDC(screenPoint);

        const nearPointClip = new Vector4(clipCoords.x, clipCoords.y, -1.0, 1.0);
        const farPointClip = new Vector4(clipCoords.x, clipCoords.y, 1.0, 1.0);

        const inverseProjectionMatrix = this.projectionMatrix.inverse();

        // Passo 2: Transformar o ponto de clip space para o espaço da câmera
        const nearPointCamera = inverseProjectionMatrix.multiplyVec4(nearPointClip).perspectiveDivide();
        const farPointCamera = inverseProjectionMatrix.multiplyVec4(farPointClip).perspectiveDivide();

        // Passo 3: Transformar os pontos de câmera para o espaço mundial
        const nearPointWorld = this.transform.transformPointToWorldSpace(nearPointCamera);
        const farPointWorld = this.transform.transformPointToWorldSpace(farPointCamera);

        // Direção do raio: ponto distante menos o ponto próximo
        const rayDirection = farPointWorld.subtract(nearPointWorld).normalized;

        // Origem do raio é o ponto próximo
        const rayOrigin = nearPointWorld;

        // Retornar o raio
        return new Ray(rayOrigin, rayDirection);
    }

    public worldPointToScreenPoint(worldPoint: Vector3): Vector3 {
        // 1. Transformar o ponto do mundo para o espaço da câmera (view space)
        const cameraSpacePos = this.viewMatrix.multiplyVec4(worldPoint.toVec4());
    
        // 2. Projeção do ponto do espaço da câmera para o espaço de recorte
        const clipSpace = this.projectionMatrix.multiplyVec4(cameraSpacePos);
        const clipSpacePos = clipSpace.perspectiveDivide();
    
        // 3. Converter as coordenadas de clip space (-1 a 1) para o espaço da tela
        const screenX = (clipSpacePos.x + 1) * 0.5 * Display.width; // X: [0, Display.width]
        const screenY = (1 - clipSpacePos.y) * 0.5 * Display.height; // Y: [0, Display.height] (invertido)
    
        // 4. Mapear Z para o intervalo [0, 1] para o buffer de profundidade
        const screenZ = (clipSpacePos.z + 1) * 0.5; // Z: [0, 1]
    
        // 5. Retornar as coordenadas finais de tela (X, Y, Z)
        return new Vector3(screenX, screenY, screenZ);
    }
    
    public transformScreenPointToWorldPoint(screenPoint: Vector3): Vector3 {
        // 1. Converter as coordenadas de tela para o espaço de recorte (clip space)
        const clipX = (screenPoint.x / Display.width) * 2 - 1; // X: [0, Display.width] -> [-1, 1]
        const clipY = 1 - (screenPoint.y / Display.height) * 2; // Y: [0, Display.height] -> [1, -1] (invertido)
        const clipZ = screenPoint.z * 2 - 1; // Z: [0, 1] -> [-1, 1]
    
        const clipSpacePos = new Vector4(clipX, clipY, clipZ, 1);
    
        // 2. Aplicar a inversa da matriz de projeção para obter o ponto no espaço da câmera (view space)
        const inverseProjectionMatrix = this.projectionMatrix.inverse();
        const cameraSpacePos = inverseProjectionMatrix.multiplyVec4(clipSpacePos);
    
        // 3. Aplicar a inversa da matriz de visualização para obter o ponto no espaço do mundo (world space)
        const inverseViewMatrix = this.viewMatrix.inverse();
        const worldSpacePos = inverseViewMatrix.multiplyVec4(cameraSpacePos);
    
        // 4. Retornar as coordenadas do ponto no espaço do mundo (X, Y, Z)
        return new Vector3(worldSpacePos.x, worldSpacePos.y, worldSpacePos.z);
    }
}