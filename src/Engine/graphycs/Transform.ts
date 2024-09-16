import Matrix4x4 from "../../../engine_modules/matrices/Matrix4x4";
import Quaternion from "../../../engine_modules/vectors/Quaternion";
import Vector3 from "../../../engine_modules/vectors/Vector3";

export default class Transform {
    position: Vector3;
    rotation: Quaternion;
    scale: Vector3;

    constructor(
        postion: Vector3 = Vector3.zero, 
        rotation: Quaternion = Quaternion.identity, 
        scale: Vector3 = Vector3.one
    ) {
        this.position = postion;
        this.rotation = rotation;
        this.scale = scale;
    }
    
    public get left(): Vector3 {
        return this.rotation.multiplyVec3(Vector3.left);
    }
    public get upward(): Vector3 {
        return this.rotation.multiplyVec3(Vector3.upward);
    }
    public get forward(): Vector3 {
        return this.rotation.multiplyVec3(Vector3.forward);
    }
    public get right(): Vector3 {
        return this.rotation.multiplyVec3(Vector3.right);
    }
    public get backward(): Vector3 {
        return this.rotation.multiplyVec3(Vector3.backward);
    }

    public set degress(angles: Vector3) {
        this.rotation = Quaternion.fromEulerAngles(angles);
    }

    
    public translate(newTranslation: Vector3) {
        const forward = this.left.normalize();
        const right = this.right.normalize();
        const up = this.upward.normalize();
      
        this.position.increment(forward.scale(newTranslation.z));
        this.position.increment(right.scale(newTranslation.x));
        this.position.increment(up.scale(newTranslation.y));
    }
    

    get modelMatrix(): Matrix4x4 {
        return Matrix4x4.createModelMatrix(this.position, this.rotation, this.scale);
    }

    public drawGizmos() {
        // const cameraPosition = Camera.main.camera.transform.position;
        // const distance = Math.max(0.1, Vec3.distance(this.position, cameraPosition));
        // const scale = 0.1 * distance;
        
        // const localXAxis = Vec3.left;
        // const localYAxis = Vec3.up;
        // const localZAxis = Vec3.forward;

        // const globalXAxis = Quat.multiplyVec3(this.rotation, localXAxis)
        // .normalize()
        // .multiplyScalar(scale);

        // const globalYAxis = Quat.multiplyVec3(this.rotation, localYAxis).
        // normalize()
        // .multiplyScalar(scale);
        
        // const globalZAxis = Quat.multiplyVec3(this.rotation, localZAxis)
        // .normalize()
        // .multiplyScalar(scale);
    
        // // Calcule os pontos finais
        // const xEnd = this.position.add(globalXAxis);
        // const yEnd = this.position.add(globalYAxis);
        // const zEnd = this.position.add(globalZAxis);
    
        // Gizmos.color = Color.red;
        // Gizmos.drawLine(this.position, xEnd);
        // Gizmos.drawMesh(
        //     DefaultValues.coneMesh, 
        //     xEnd, 
        //     Quat.fromEulerAngles(new Vec3(0, -90, 0)), 
        //     new Vec3(0.1, 0.1, 0.1).scale(scale)
        // )
       
        // Gizmos.color = Color.green;
        // Gizmos.drawLine(this.position, yEnd);
        // Gizmos.drawMesh(
        //     DefaultValues.coneMesh, 
        //     yEnd, 
        //     Quat.fromEulerAngles(new Vec3(-90, 0, 0)), 
        //     new Vec3(0.1, 0.1, 0.1).scale(scale)
        // )
        
        // Gizmos.color = Color.blue;
        // Gizmos.drawLine(this.position, zEnd);
        // Gizmos.drawMesh(
        //     DefaultValues.coneMesh, 
        //     zEnd, 
        //     Quat.fromEulerAngles(new Vec3(0, 0, 0)), 
        //     new Vec3(0.1, 0.1, 0.1).scale(scale)
        // )
    }

    public transformPointToWorldSpace(point: Vector3): Vector3 {
        const modelMatrix = this.modelMatrix;
        return Vector3.transform(point, modelMatrix);
    }

    public transformPointToLocalSpace(point: Vector3): Vector3 {
        const modelMatrix = this.modelMatrix;
        const inverseModelMatrix = modelMatrix.inverse();
        const localSpace = inverseModelMatrix.multiplyVec3(point);
        return localSpace;
    }
}