import Matrix4x4 from "../../../engine_modules/matrices/Matrix4x4";
import Quaternion from "../../../engine_modules/vectors/Quaternion";
import Vector3 from "../../../engine_modules/vectors/Vector3";
import { drawTransformGizmos } from "../../engine_visual/TransformGizmos";
import Component from "../components/Component";

export default class Transform extends Component {
    position: Vector3;
    rotation: Quaternion;
    scale: Vector3;
  
    constructor(
        postion: Vector3 = Vector3.zero, 
        rotation: Quaternion = Quaternion.identity, 
        scale: Vector3 = Vector3.one
    ) {
        super("Transform")
        this.position = postion;
        this.rotation = rotation;
        this.scale = scale;
    }
    
    public get left(): Vector3 {
        return this.rotation.multiplyVector3(Vector3.left).normalize();
    }
    public get upward(): Vector3 {
        return this.rotation.multiplyVector3(Vector3.upward).normalize();
    }
    public get forward(): Vector3 {
        return this.rotation.multiplyVector3(Vector3.forward).normalize();
    }
    public get right(): Vector3 {
        return this.rotation.multiplyVector3(Vector3.right).normalize();
    }
    public get backward(): Vector3 {
        return this.rotation.multiplyVector3(Vector3.backward).normalize();
    }
    
    public translate(newTranslation: Vector3) {
        this.position.increment(this.forward.scale(newTranslation.z));
        this.position.increment(this.right.scale(newTranslation.x));
        this.position.increment(this.upward.scale(newTranslation.y));
    }

    public rotate(newRotation: Quaternion) {
        this.rotation.multiplyQuat(newRotation);
    }
    

    get modelMatrix(): Matrix4x4 {
        return Matrix4x4.createModelMatrix(this.position, this.rotation, this.scale);
    }

    public drawGizmos() {
       drawTransformGizmos(this);
    }

    public transformPointToWorldSpace(point: Vector3): Vector3 {
        const modelMatrix = this.modelMatrix;
        return Vector3.transform(point, modelMatrix);
    }

    public transformPointToLocalSpace(point: Vector3): Vector3 {
        const inverseModel = this.modelMatrix.inverse();
        const localSpace = inverseModel.multiplyVec3(point);
        return localSpace;
    }
}