import Matrix4x4 from "../../engine_modules/matrices/Matrix4x4";
import Vector3 from "../../engine_modules/vectors/Vector3";
import Vector4 from "../../engine_modules/vectors/Vector4";
import Ray from "../Base/Mathf/Ray";
import Component from "./Component";
import Color from "../Engine/static/color";
import { Main, WindowScreen } from "../main";


export default class Camera extends Component {
   
    public static main: Main;
    public fieldOfView: number;
    public aspectRatio: number;
    public nearPlane: number;
    public farPlane: number;
    public depth: boolean;
    public clearColor: Color;

    constructor() {
        super("Camera");
        this.fieldOfView = 60;
        this.aspectRatio = 16 / 9;
        this.nearPlane = 0.3;
        this.farPlane = 1000;
        this.depth = true;
        this.clearColor = Color.darkGray;
    }

    public get viewMatrix(): Matrix4x4 {
        return this.transform.modelMatrix.inverse();
    } 

    public get projectionMatrix(): Matrix4x4 {
        return Matrix4x4.perspective(this.fieldOfView, this.aspectRatio, this.nearPlane, this.farPlane);
    }
    
    screenPointToRay(screenPoint: Vector3): Ray {
        // Passo 1: Converter o ponto da tela para coordenadas NDC (com origem no canto inferior esquerdo)
        const clipCoords = WindowScreen.screenToNDC(screenPoint);
    
        const clipSpacePos = new Vector4(clipCoords.x, clipCoords.y, 1.0, 1.0);
    
        const projectionMatrix = this.projectionMatrix;
        const viewMatrix = this.viewMatrix;
    
        // Passo 4: Calcular a inversa da matriz de projeção
        const inverseProjectionMatrix = projectionMatrix.inverse();
        const inverseViewMatrix = viewMatrix.inverse();
    
        // Passo 5: Transformar o ponto de clip space para o espaço da câmera
        const cameraCoords = inverseProjectionMatrix.multiplyVec4(clipSpacePos).perspectiveDivide();
    
        // Passo 6: Transformar a direção do raio do espaço da câmera para o espaço do mundo
        const rayDirectionWorld = inverseViewMatrix.multiplyVec3(cameraCoords);
    
        const rayOriginWorld = this.transform.position;
    
        // Retornar o raio
        return new Ray(rayOriginWorld, rayDirectionWorld);
    }

    drawGizmos(): void {
        // Gizmos.color = Color.white;
        // CameraGizmos.drawPerspectiveGizmos(this);
    }

}    


