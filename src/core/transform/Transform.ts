import Component from "../components/Component";
import Vector3 from "../math/Vector3";
import Quaternion from "../math/Quaternion";
import Matrix4x4 from "../math/Matrix4x4";
import { Space } from "../enum/Space";
import Rotation from "./Rotation";
import Translation from "./Translation";
import TransformHierarchy from "./Parent";

export default class Transform extends Component {
    // === Hierarchy ===
    public readonly hierarchy: TransformHierarchy;

    // === Local Transform Data ===
    private positionData: Vector3;
    private rotationData: Quaternion;
    private scaleData: Vector3;

    // === Cached Model Matrix ===
    private modelMatrixData: Matrix4x4;

    constructor(
        position: Vector3 = new Vector3(0, 0, 0),
        rotation: Quaternion = new Quaternion(0, 0, 0, 1),
        scale: Vector3 = new Vector3(1, 1, 1),
    ) {
        super("Transform", "Transform");

        this.positionData = position;
        this.positionData.onChange(() => this.updateModelMatrix());
        this.rotationData = rotation;
        this.rotationData.onChange(() => this.updateModelMatrix());
        this.scaleData = scale;
        this.scaleData.onChange(() => this.updateModelMatrix());
        this.modelMatrixData = Matrix4x4.identity;

        this.hierarchy = new TransformHierarchy(this);
    }

    // === Getters and Setters ===

    public get position(): Vector3 {
        return this.positionData;
    }

    public get rotation(): Quaternion {
        return this.rotationData;
    }


    public get scale(): Vector3 {
        return this.scaleData;
    }


    public set position(value: Vector3) {
        if (!this.positionData.equals(value)) {
            this.positionData = value;
            this.positionData.onChange(() => this.updateModelMatrix());
            this.updateModelMatrix();
        }
    }

    public set rotation(value: Quaternion) {
        if (!this.rotationData.equals(value)) {
            this.rotationData = value;
            this.rotationData.onChange(() => this.updateModelMatrix());
            this.updateModelMatrix();
        }
    }

    public set scale(value: Vector3) {
        if (!this.scaleData.equals(value)) {
            this.scaleData = value;
            this.scaleData.onChange(() => this.updateModelMatrix());
            this.updateModelMatrix();
        }
    }


    public get modelMatrix(): Matrix4x4 {
        const parent = this.hierarchy.parent;
        return parent
            ? this.modelMatrixData.multiply(parent.modelMatrix)
            : this.modelMatrixData;
    }

    public get globalPosition(): Vector3 {
        return this.modelMatrix.getTranslation();
    }

    public get forward(): Vector3 {
        return this.rotationData.multiplyVector3(Vector3.FORWARD);
    }

    public get right(): Vector3 {
        return this.rotationData.multiplyVector3(Vector3.RIGHT);
    }

    public get up(): Vector3 {
        return this.rotationData.multiplyVector3(Vector3.UP);
    }

    // === Transform Operations ===

    public translate(translation: Vector3, space: Space = Space.SELF): void {
        Translation.createTranslationByDirection(this.position, this.rotation, translation, space);
        this.updateModelMatrix();
    }

    public rotate(axis: Vector3, angle: number, space: Space = Space.SELF): void {
        Rotation.createRotationByAxis(this.rotation, axis, angle, space);
        this.updateModelMatrix();
    }

    public rotateAround(point: Vector3, axis: Vector3, angle: number): void {
        Rotation.rotateAroundPoint(this.position, this.rotation, point, axis, angle);
        this.updateModelMatrix();
    }

    // === Space Conversions ===

    public transformPointToWorldSpace(point: Vector3): Vector3 {
        return this.modelMatrix.multiplyVec3(point);
    }

    public transformPointToLocalSpace(point: Vector3): Vector3 {
        return this.modelMatrix.inverse().multiplyVec3(point);
    }

    // === Internal Update ===


    private modelMatrixCallback?: () => void;

    public onModelMatrixUpdate(callback: () => void): void {
        this.modelMatrixCallback = callback;
    }

    private updateModelMatrix(): void {
        this.modelMatrixData = Matrix4x4.createModelMatrix(
            this.positionData,
            this.rotationData,
            this.scaleData
        );

        if (this.modelMatrixCallback) {
            this.modelMatrixCallback();
        }
    }
}
