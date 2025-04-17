import Matrix4x4 from "../math/Matrix4x4";
import Ray from "../physics/Ray";
import Component from "./Component";
import Color from "../math/color";
import { NullReferenceException } from "../Error";
import Vector3 from "../math/Vector3";
import Vector4 from "../math/Vector4";
import Display from "./Display";
import SceneManager from "../managers/SceneManager";

export default class Camera extends Component {

    public static readonly TYPE = "Camera";
    // Propriedades privadas
    private _fieldOfView: number;
    private _aspectRatio: number;
    private _nearPlane: number;
    private _farPlane: number;
    private _depth: boolean;
    private _clearColor: Color;


    public get viewChanged() {
        return this.transform.modelChanged;
    }

    //#region Getters
    public get fieldOfView(): number {
        return this._fieldOfView;
    }

    public get aspectRatio(): number {
        return this._aspectRatio;
    }

    public get nearPlane(): number {
        return this._nearPlane;
    }

    public get farPlane(): number {
        return this._farPlane;
    }

    public get depth(): boolean {
        return this._depth;
    }

    public get clearColor(): Color {
        return this._clearColor;
    }
    //#endregion




    private cachedProjectionMatrix: Matrix4x4 | null = null;

    public projectionChanged: boolean = false; 
    private clearProjectionCache() {
        this.cachedProjectionMatrix = null;
        this.projectionChanged = true;
    }


    
    //#region Setters
    public set fieldOfView(fov: number) {
        if (this._fieldOfView !== fov) {
            this._fieldOfView = fov;
            this.clearProjectionCache();
        }
    }

    public set aspectRatio(aspectRatio: number) {
        if (this._aspectRatio !== aspectRatio) {
            this._aspectRatio = aspectRatio;
            this.clearProjectionCache();
        }
    }

    public set nearPlane(nearPlane: number) {
        if (this._nearPlane !== nearPlane) {
            this._nearPlane = nearPlane;
            this.clearProjectionCache();
        }
    }

    public set farPlane(farPlane: number) {
        if (this._farPlane !== farPlane) {
            this._farPlane = farPlane;
            this.clearProjectionCache();
        }
    }
    //#endregion

    //#endregion






















    public set depth(depth: boolean) {
        this._depth = depth;
    }

    public set clearColor(clearColor: Color) {
        this._clearColor = clearColor;
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
        this._clearColor = Color.CHARCOAL;
        this._fieldOfView = 60;
        this._aspectRatio = 16 / 9;
        this._nearPlane = 0.03;
        this._farPlane = 300;
        this._depth = true;
    }
    
    public get projectionMatrix(): Matrix4x4 {

        if (!this.cachedProjectionMatrix) {
            this.cachedProjectionMatrix = Matrix4x4.createPerspective(
                this._fieldOfView,
                this._aspectRatio,
                this._nearPlane,
                this._farPlane
            );
            this.projectionChanged = false;
        }
        return this.cachedProjectionMatrix;
    }

    public get viewMatrix() {
        return this.transform.modelMatrix.inverse();
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
        const rayDirection = farPointWorld.subtract(nearPointWorld).normalize();

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