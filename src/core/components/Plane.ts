import Vector3 from "../math/Vector3";


export default class Plane {
    public normal: Vector3;
    public d: number;

    constructor(x: number, y: number, z: number, constant: number) {
        this.normal = new Vector3(x, y, z);
        this.d = constant;
    }

    public normalize(): this {
        const length = this.normal.length();
        if (length > 0) {
            this.normal = this.normal.divideScalar(length);
            this.d /= length;
        }
        return this;
    } 

    public distanceToPoint(point: Vector3, epsilon = 1e-6): number {
        const distance = this.normal.dot(point) + this.d;
        return Math.abs(distance) < epsilon ? 0 : distance;
    }

    public static calculatePlane(viewProjectionMatrix: Float32Array, index: number, sign: number): Plane {
        const data = viewProjectionMatrix;
        const x = data[3] + sign * data[index];
        const y = data[7] + sign * data[4 + index];
        const z = data[11] + sign * data[8 + index];
        const w = data[15] + sign * data[12 + index];
     
        return new Plane(x, y, z, w).normalize();
    }
}
