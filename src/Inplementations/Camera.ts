import Matrix4x4 from "../../engine_modules/matrices/Matrix4x4";
import Vector3 from "../../engine_modules/vectors/Vector3";
import Vector4 from "../../engine_modules/vectors/Vector4";
import Ray from "../Base/Mathf/Ray";
import Component from "../Engine/components/Component";
import Gizmos from "../Engine/graphycs/Gizmos";
import Color from "../Engine/static/color";
// import { CameraGizmos } from "../engine_visual/CameraGizmos";
import { Main, WindowScreen } from "../main";


export default class Camera extends Component {
   
    static main: Main;
    fieldOfView: number = 60;
    aspectRatio: number = 16 / 9;
    nearPlane: number = 0.03;
    farPlane: number = 1000;
    depth: boolean = true;
    clearColor: Color = Color.darkGray;

    constructor(){
        super("Camera");
    }

    get viewMatrix(): Matrix4x4 {
        return this.transform.modelMatrix.inverse();
    } 

    get projectionMatrix(): Matrix4x4 {
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


