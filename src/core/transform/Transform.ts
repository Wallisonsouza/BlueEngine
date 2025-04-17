import Matrix4x4 from "../math/Matrix4x4";
import Component from "../components/Component";
import Quaternion from "../math/Quaternion";
import Vector3 from "../math/Vector3";
import GameObject from "../components/GameObject";
import { Space } from "../enum/Space";
import Rotation from "./Rotation";
import Translation from "./Translation";
import EngineCache from "./Cache";

export default class Transform extends Component {
    

    private _rotation: Quaternion;
    private _scale: Vector3;
    
    private _position: Vector3;
    public get position(): Vector3 { return this._position;}
       
    
    public get forward(): Vector3 {
        return this._rotation.multiplyVector3(Vector3.FORWARD);
    }

    public get right(): Vector3 {
        return this._rotation.multiplyVector3(Vector3.RIGHT);
    }

    public get up(): Vector3 {
        return this._rotation.multiplyVector3(Vector3.UP);
    }





    public get rotation(): Quaternion {
        return this._rotation;
    }
 
    public get scale(): Vector3 {
        return this._scale;
    }


    public get globalPosition() {
        return this.modelMatrix.getTranslation();
    }
   
    private cachedModelMatrix: Matrix4x4 | null = null;
    public modelChanged: boolean = false;
    public static: boolean = true;
    private clearModelCache() {
        this.cachedModelMatrix = null;
        this.modelChanged = true;
    }
    
    public set position(position: Vector3) {
        if (!this._position.equals(position)) {
            this._position = position;
            this.clearModelCache();
        }
    }

    public set rotation(rotation: Quaternion) {
        if (!this._rotation.equals(rotation)) {
            this._rotation = rotation;
            this.clearModelCache();
        }
    }
    
    public set scale(scale: Vector3) {
        if (!this._scale.equals(scale)) {
            this._scale = scale;
            this.clearModelCache();
        }
    }

 
    private get localMatrix(): Matrix4x4 {

        if(!this.cachedModelMatrix) {
            this.cachedModelMatrix = Matrix4x4.composeMatrix(
                this.position,  
                this.rotation,  
                this.scale  
            );

            this.modelChanged = false;
        }
       
        return this.cachedModelMatrix;
    }
    
    public get modelMatrix(): Matrix4x4 {
        if (!this.parent) {
            return this.localMatrix;
        } else {
            const parentMatrix = this.parent.modelMatrix;
            return this.localMatrix.multiply(parentMatrix)
        }
    }

 
    constructor(
        position: Vector3 = Vector3.zero, 
        rotation: Quaternion = Quaternion.IDENTITY, 
        scale: Vector3 = Vector3.one,
    ) {
        super("Transform", "Transform");
        this._position = position;
        this._rotation = rotation;
        this._scale = scale;
        EngineCache.add<Matrix4x4>(this.id, this.modelMatrix);
    } 
    
    public translate(newTranslation: Vector3, space: Space = Space.SELF): void {
        Translation.createTranslationByDirection(this.position, this.rotation, newTranslation, space);
        EngineCache.updateCache<Matrix4x4>(this.id, this.modelMatrix);
    }

    public rotate(axis: Vector3, angle: number, space: Space = Space.SELF): void {
        Rotation.createRotationByAxys(this.rotation, axis, angle, space);
        EngineCache.updateCache<Matrix4x4>(this.id, this.modelMatrix);
    }
    
    public rotateAround(point: Vector3, axis: Vector3, angle: number): void {
        Rotation.createRotationAround(this.position, this.rotation, point, axis, angle);
        EngineCache.updateCache<Matrix4x4>(this.id, this.modelMatrix);
    }

    public transformPointToWorldSpace(point: Vector3): Vector3 {
        const modelMatrix = this.modelMatrix;
        return modelMatrix.multiplyVec3(point);
    }

    public transformPointToLocalSpace(point: Vector3): Vector3 {
        const inverseModel = this.modelMatrix.inverse();
        return inverseModel.multiplyVec3(point);
    }


    public childrens: Transform[] =[];
    private parent: Transform | null = null;
    
    public setParent(parent: Transform | null): void {
        if (parent === this) {
            console.error("Um objeto não pode ser pai de si mesmo.");
            return;
        }
    
        if (this.parent !== parent) {
            this.parent = parent;
        }

        if(!parent?.childrens.includes(this)) {
            parent?.childrens.push(this);
        }
    }
    
    public get childCount(): number {
        return this.childrens.length;
    }

    

    // public onDrawGizmos(): void {
    //     const camera = Camera.main;
    //     let distance = this.transform.position.distanceTo(camera.transform.position);
    //     distance = Mathf.clamp(distance, 0.1, Infinity);
    //     const scale = distance * 0.2;

    //     const globalXAxis = this.transform.right.multiplyScalar(scale);
    //     const globalYAxis = this.transform.up.multiplyScalar(scale);
    //     const globalZAxis = this.transform.forward.multiplyScalar(scale);

    //     const xEnd = this.transform.position.add(globalXAxis);
    //     const yEnd = this.transform.position.add(globalYAxis);
    //     const zEnd = this.transform.position.add(globalZAxis);

    //     Gizmos.color = Color.RED;
    //     Gizmos.drawLine(this.transform.position, xEnd);
    //     Gizmos.color = Color.GREEN;
    //     Gizmos.drawLine(this.transform.position, yEnd);
    //     Gizmos.color = Color.BLUE;
    //     Gizmos.drawLine(this.transform.position, zEnd);
    // }
}