import Matrix4x4 from "../math/Matrix4x4";
import Camera from "./Camera";
import Component from "./Component";
import Quaternion from "../math/Quaternion";
import Vector3 from "../math/Vector3";
import GameObject from "./GameObject";
import Mathf from "../math/Mathf";
import { Space } from "../enum/Space";
import Color from "../math/color";

export default class Transform extends Component {
    
    private _position: Vector3;
    private _rotation: Quaternion;
    private _scale: Vector3;

    public get position(): Vector3 {
        return this._position;
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

    public get forward(): Vector3 {
        return this._rotation.multiplyVector3(Vector3.FORWARD);
    }

    public get right(): Vector3 {
        return this._rotation.multiplyVector3(Vector3.RIGHT);
    }

    public get up(): Vector3 {
        return this._rotation.multiplyVector3(Vector3.UP);
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

    constructor(
        position: Vector3 = Vector3.zero, 
        rotation: Quaternion = Quaternion.IDENTITY, 
        scale: Vector3 = Vector3.one,
        gameObject: GameObject | null = null
    ) {
        super("Transform", "Transform");
        this._position = position;
        this._rotation = rotation;
        this._scale = scale;
        // this._gameObject = gameObject;
    } 
    
    public translate(newTranslation: Vector3, space: Space = Space.SELF): void {
        switch (space) {
            case Space.SELF:
                const localTranslation = this._rotation.transformVector3(newTranslation);
                this._position.addInPlace(localTranslation);
                break;
        
            case Space.WORLD:
                this._position = this._position.add(newTranslation);
                break;
            
            default:
                console.error('Espaço de translação inválido. Use Space.SELF ou Space.WORLD.');
                return;
        }
      
        this.clearModelCache();
    }
    
    
    /**
     * Aplica uma rotação no objeto, com base no eixo e no ângulo fornecidos.
     * 
     * @param axis O eixo de rotação (um vetor tridimensional).
     * @param angle O ângulo de rotação, em graus.
     * @param space O espaço no qual a rotação ocorre. Pode ser `Space.SELF` (local) ou `Space.WORLD` (global). O padrão é `Space.SELF`.
     */
    public rotate(axis: Vector3, angle: number, space: Space = Space.SELF): void {
        const normalizedAxis = axis.normalize(); 
        const radians = Mathf.degToRad(angle);
    
        switch (space) {
            case Space.SELF:
                const rotationQuat = Quaternion.createRotationAxis(normalizedAxis, radians);
                this._rotation = this._rotation.multiply(rotationQuat).normalized();
                break;
    
            case Space.WORLD:
                const localAxis = this._rotation.inverse().transformVector3(normalizedAxis);
                const worldRotationQuat = Quaternion.createRotationAxis(localAxis, radians);
                this._rotation = this._rotation.multiply(worldRotationQuat).normalized();
                break;
            
            default:
                console.error('Espaço de rotação inválido. Use Space.SELF ou Space.WORLD.');
                return;
        }
    
        this.clearModelCache();
    }
    
    public rotateAround(point: Vector3, axis: Vector3, angle: number): void {
      
        const normalizedAxis = axis.normalize();
        const radians = Mathf.degToRad(angle);
    
        const offset = this.position.subtract(point);
    
        const rotationQuat = Quaternion.createRotationAxis(normalizedAxis, radians);
        const rotatedOffset = rotationQuat.multiplyVector3(offset);
    
  
        this.position = point.add(rotatedOffset);
    
        this.rotation = rotationQuat.multiply(this.rotation).normalized();
        this.clearModelCache();
    }
    

    public transformPointToWorldSpace(point: Vector3): Vector3 {
        const modelMatrix = this.modelMatrix;
        return modelMatrix.multiplyVec3(point);
    }

    public transformPointToLocalSpace(point: Vector3): Vector3 {
        const inverseModel = this.modelMatrix.inverse();
        return inverseModel.multiplyVec3(point);
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