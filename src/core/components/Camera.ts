import Matrix4x4 from "../math/Matrix4x4";
import Ray from "../physics/Ray";
import Component from "./Component";
import Color from "../math/color";
import { WindowScreen } from "../../main";
import { NullReferenceException } from "../Error";
import Vector3 from "../math/Vector3";
import Vector4 from "../math/Vector4";
import GameObject from "./GameObject";


export default class Camera extends Component {
   
    public fieldOfView: number;
    public aspectRatio: number;
    public nearPlane: number;
    public farPlane: number;
    public depth: boolean;
    public clearColor: Color;

    public static get mainCamera(): Camera {
        const cameraObject = GameObject.getGameObjectByTag("MainCamera");
        if (!cameraObject) {
            throw new NullReferenceException("Câmera principal não encontrada.");
        }

        const cameraComponent = cameraObject.getComponent(Camera);
        if (!cameraComponent) {
            throw new NullReferenceException("Componente de câmera não encontrado no objeto da câmera principal.");
        }

        return cameraComponent;
    }

    constructor() {
        super("Camera");
        this.clearColor = Color.gray;
        this.fieldOfView = 60;
        this.aspectRatio = 16 / 9;
        this.nearPlane = 0.03;
        this.farPlane = 1000;
        this.depth = true;
    }

    public get viewMatrix(): Matrix4x4 {
        return this.transform.modelMatrix.inverse();
    } 

    public get projectionMatrix(): Matrix4x4 {
        return Matrix4x4.perspective(this.fieldOfView, this.aspectRatio, this.nearPlane, this.farPlane);
    }

    public get clipMatrix(): Matrix4x4 {
        const projection = this.projectionMatrix;
        const view = this.viewMatrix;
        return Matrix4x4.multiply(projection, view);
    }
    
    screenPointToRay(screenPoint: Vector3): Ray {
        // Passo 1: Converter o ponto da tela para coordenadas NDC (origem no centro da tela)
        const clipCoords = WindowScreen.screenToNDC(screenPoint);
        
        
        
        // Ponto no espaço de clip (ponto próximo e ponto distante)
        const nearPointClip = new Vector4(clipCoords.x, clipCoords.y, -1.0, 1.0);
        const farPointClip = new Vector4(clipCoords.x, clipCoords.y, 1.0, 1.0);
    
        const inverseProjectionMatrix = this.projectionMatrix.inverse();
        const inverseViewMatrix = this.viewMatrix.inverse();
    
        // Passo 2: Transformar o ponto de clip space para o espaço da câmera
        const nearPointCamera = inverseProjectionMatrix.multiplyVec4(nearPointClip).perspectiveDivide();
        const farPointCamera = inverseProjectionMatrix.multiplyVec4(farPointClip).perspectiveDivide();
    
        // Passo 3: Transformar os pontos de câmera para o espaço mundial
        const nearPointWorld = inverseViewMatrix.multiplyVec4(new Vector4(nearPointCamera.x, nearPointCamera.y, nearPointCamera.z, 1.0)).toVec3();
        const farPointWorld = inverseViewMatrix.multiplyVec4(new Vector4(farPointCamera.x, farPointCamera.y, farPointCamera.z, 1.0)).toVec3();
    
        // Direção do raio: ponto distante menos o ponto próximo
        const rayDirection = farPointWorld.subtract(nearPointWorld).normalize();
    
        // Origem do raio é o ponto próximo
        const rayOrigin = nearPointWorld;
    
        // Retornar o raio
        return new Ray(rayOrigin, rayDirection);
    }
    

    drawGizmos(): void {
        // Gizmos.color = Color.white;
        // CameraGizmos.drawPerspectiveGizmos(this);
    }
}    


