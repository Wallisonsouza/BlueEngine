import { Space } from "../enum/Space";
import Mathf from "../math/Mathf";
import Quaternion from "../math/Quaternion";
import Vector3 from "../math/Vector3";

export default class Rotation {

    public static createRotationByAxis(rotation: Quaternion, axis: Vector3, angle: number, space: Space = Space.SELF): void {
       
        const normalizedAxis = axis.normalize(); 
        const radians = Mathf.degToRad(angle);
    
        switch (space) {
            case Space.SELF:
                const rotationQuat = Quaternion.createRotationAxis(normalizedAxis, radians);
                rotation = rotation.multiply(rotationQuat).normalized();
                break;
    
            case Space.WORLD:
                const localAxis = rotation.inverse().transformVector3(normalizedAxis);
                const worldRotationQuat = Quaternion.createRotationAxis(localAxis, radians);
                rotation = rotation.multiply(worldRotationQuat).normalized();
                break;
            
            default:
                console.error('Espaço de rotação inválido. Use Space.SELF ou Space.WORLD.');
                return;
        }
    }

    public static rotateAroundPoint(position: Vector3, rotation: Quaternion, point: Vector3, axis: Vector3, angle: number): void {
          
        const normalizedAxis = axis.normalize();
        const radians = Mathf.degToRad(angle);
    
        const offset = position.subtract(point);
    
        const rotationQuat = Quaternion.createRotationAxis(normalizedAxis, radians);
        const rotatedOffset = rotationQuat.multiplyVector3(offset);
    
        position = point.add(rotatedOffset);
    
        rotation = rotationQuat.multiply(rotation).normalized();
       
    }
    
}