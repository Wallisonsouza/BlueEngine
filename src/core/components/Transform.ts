import Matrix4x4 from "../math/Matrix4x4";
import { WindowScreen } from "../../main";
import Camera from "./Camera";
import Component from "./Component";
import Quaternion from "../math/Quaternion";
import Vector3 from "../math/Vector3";
import Vector4 from "../math/Vector4";
import GameObject from "./GameObject";
import List from "./List";

export default class Transform extends Component {
    
    position: Vector3;
    rotation: Quaternion;
    scale: Vector3;

    public childrens: List<Transform>;
    private parent: Transform | null = null;
    
    public setParent(parent: Transform | null): void {
        if (parent === this) {
            console.error("Um objeto não pode ser pai de si mesmo.");
            return;
        }
    
        if (this.parent !== parent) {
            this.parent = parent;
        }

        if(!parent?.childrens.contains(this)) {
            parent?.childrens.add(this);
        }
    }
    
    public get childCount(): number {
        return this.childrens.count;
    }


    public getPositionOffset() {
        return this.modelMatrix.getTranslation();
    }

    constructor(
        postion: Vector3 = Vector3.zero, 
        rotation: Quaternion = Quaternion.identity, 
        scale: Vector3 = Vector3.one,
        gameObject: GameObject | null = null
    ) {
        super("Transform");
        this.position = postion;
        this.rotation = rotation;
        this.scale = scale;
        this.childrens = new List<Transform>();
        this._gameObject = gameObject;

    }
   
    public get forward(): Vector3 {
        return this.rotation.multiplyVector3(Vector3.forward);
    }

    public get right(): Vector3 {
        return this.rotation.multiplyVector3(Vector3.right);
    }

    public get up(): Vector3 {
        return this.rotation.multiplyVector3(Vector3.up);
    }

    public get modelMatrix(): Matrix4x4 {
        const localMatrix = Matrix4x4.createModelMatrix(
            this.position,  // Posição local
            this.rotation,  // Rotação local
            this.scale      // Escala local
        );
    
        if (!this.parent) {
            return localMatrix;
        }
    
        const adjustedPosition = this.parent.rotation.multiplyVector3(this.transform.position);
        const adjustedLocalMatrix = Matrix4x4.createModelMatrix(
            adjustedPosition,
            this.rotation,
            this.scale
        );

        const matrix = this.parent.modelMatrix.multiply(adjustedLocalMatrix);
        this.position = matrix.getTranslation();
        return matrix;
    }
    
    public translate(newTranslation: Vector3) {
        this.position.increment(this.forward.scale(newTranslation.z));
        this.position.increment(this.right.scale(newTranslation.x));
        this.position.increment(this.up.scale(newTranslation.y));
    }

    public rotate(axis: Vector3, speed: number) {
        this.rotation = this.rotation.multiply(Quaternion.createRotationAxis(axis, speed)).normalize();
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
    
    public transformScreenPointToWorldPoint(screenPoint: Vector3): Vector3 {
        const ndc = WindowScreen.screenToNDC(screenPoint);
        const clipCoords = new Vector4(ndc.x, ndc.y, -1, 1); // Definindo z como -1 para o plano perto

        const camera = Camera. mainCamera;
        const inverseProjectionMatrix = camera.projectionMatrix.inverse();
        const cameraCoords = inverseProjectionMatrix.multiplyVec4(clipCoords).perspectiveDivide();
        const inverseViewMatrix = camera.viewMatrix.inverse();
        const worldPoint = inverseViewMatrix.multiplyVec4(new Vector4(cameraCoords.x, cameraCoords.y, cameraCoords.z, 1));

        return worldPoint.toVec3().normalize();
    }

    public drawGizmos() {
        
    }

}