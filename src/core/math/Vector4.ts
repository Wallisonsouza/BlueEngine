import Vector3 from "./Vector3";

export default class  Vector4 {
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    constructor(x: number, y: number, z: number, w: number) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    toVec3(): Vector3 {
        return new Vector3(this.x / this.w, this.y / this.w, this.z / this.w);
    }

    divide(scalar: number): Vector4 {
        if (scalar === 0) {
            throw new Error("Divisão por zero");
        }
        return new Vector4(this.x / scalar, this.y / scalar, this.z / scalar, this.w / scalar);
    }

    public perspectiveDivide(): Vector3 {
        if (this.w !== 0) {
            return new Vector3(this.x / this.w, this.y / this.w, this.z / this.w);
        } else {
            return new Vector3(0, 0, 0);
        }
    }

}