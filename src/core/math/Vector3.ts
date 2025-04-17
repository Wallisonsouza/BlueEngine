import Matrix4x4 from "./Matrix4x4";
import Mathf from "./Mathf";
import Vector4 from "./Vector4";

export default class Vector3 {
    x: number;
    y: number;
    z: number;

    public toVec4(){
        return new Vector4(this.x, this.y, this.z, 1);
    }
    
    public static readonly SIZE = 3;
    public static readonly one = new Vector3(1, 1, 1);
    public static readonly UP = new Vector3(0, 1, 0);
    public static readonly FORWARD = new Vector3(0, 0, 1);
    public static readonly RIGHT = new Vector3(1, 0, 0);
    public static readonly BACK = new Vector3(0, 0, -1);
    public static readonly DOWN = new Vector3(0, -1, 0);
    public static readonly LEFT = new Vector3(-1, 0, 0);
    public static readonly zero = new Vector3(0, 0, 0);

    public clone(){
        return new Vector3(this.x, this.y, this.z);
    }

    public set(x: number, y: number, z: number): Vector3 {
        this.x = x;
        this.y = y;
        this.z = z;
        return this; 
    }
 
    static random(min: number = 0, max: number = 1): Vector3 {

        return new Vector3(
            Mathf.randomRange(min, max),
            Mathf.randomRange(min, max),
            Mathf.randomRange(min, max) 
        );
    }

    public static transform(vec: Vector3, m: Matrix4x4): Vector3 {

        const data = m.getData();
        
        const x = vec.x * data[0] + vec.y * data[4] + vec.z * data[8] + data[12];
        const y = vec.x * data[1] + vec.y * data[5] + vec.z * data[9] + data[13];
        const z = vec.x * data[2] + vec.y * data[6] + vec.z * data[10] + data[14];

        return new Vector3(x, y, z);
    }

    public addInPlace(other: Vector3): this {
        this.x += other.x;
        this.y += other.y;
        this.z += other.z;
        return this;
    }


    constructor(x: number = 0, y: number = 0, z: number = 0) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    public static abs(v: Vector3) {
        return new Vector3(Math.abs(v.x), Math.abs(v.y), Math.abs(v.z))
    }

    public static fromNumber(v: number) {
        return new Vector3(v, v, v);
    }
  
    add(vector: Vector3): Vector3 {
        return new Vector3(this.x + vector.x, this.y + vector.y, this.z + vector.z);
    }

    public min(other: Vector3): Vector3 {
        this.x = Math.min(this.x, other.x);
        this.y = Math.min(this.y, other.y);
        this.z = Math.min(this.z, other.z);
        return this;
    }

    public max(other: Vector3): Vector3 {
        this.x = Math.max(this.x, other.x);
        this.y = Math.max(this.y, other.y);
        this.z = Math.max(this.z, other.z);
        return this;
    }

    increment(vector: Vector3): Vector3 {
        return new Vector3(this.x += vector.x, this.y += vector.y, this.z += vector.z);
    }
   

    public equals(other: Vector3, tolerance: number = 1e-6): boolean {
        return Mathf.abs(this.x - other.x) < tolerance &&
               Mathf.abs(this.y - other.y) < tolerance &&
               Mathf.abs(this.z - other.z) < tolerance;
    }

    lengthSquared(): number {
        return this.x * this.x + this.y * this.y + this.z * this.z;
    }

    subtract(vector: Vector3): Vector3 {
        return new Vector3(this.x - vector.x, this.y - vector.y, this.z - vector.z);
    }

    divide(vector: Vector3): Vector3 {
        const x = vector.x !== 0 ? this.x / vector.x : 0;
        const y = vector.y !== 0 ? this.y / vector.y : 0;
        const z = vector.z !== 0 ? this.z / vector.z : 0;
        return new Vector3(x, y, z);
    }
    
    multiply(vector: Vector3): Vector3 {
        return new Vector3(this.x * vector.x, this.y * vector.y, this.z * vector.z);
    }

    multiplyScalar(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }
    scale(scalar: number): Vector3 {
        return new Vector3(this.x * scalar, this.y * scalar, this.z * scalar);
    }

    magnitude(): number {
        return Mathf.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }


    dot(vector: Vector3): number {
        return this.x * vector.x + this.y * vector.y + this.z * vector.z;
    }

    cross(vector: Vector3): Vector3 {
        return new Vector3(
            this.y * vector.z - this.z * vector.y,
            this.z * vector.x - this.x * vector.z,
            this.x * vector.y - this.y * vector.x
        );
    }

    divideScalar(scalar: number): Vector3 {
        if (scalar === 0) throw new Error("Division by zero");
        return new Vector3(this.x / scalar, this.y / scalar, this.z / scalar);
    }
    negative(): Vector3 {
        return new Vector3(-this.x, -this.y, -this.z);
    }
    

    public static lerpUnclamped(start: Vector3, end: Vector3, t: number): Vector3 {
        const x = start.x + (end.x - start.x) * t;
        const y = start.y + (end.y - start.y) * t;
        const z = start.z + (end.z - start.z) * t;
    
        return new Vector3(x, y, z);
    }
    public static lerp(start: Vector3, end: Vector3, t: number): Vector3 {
        t = Math.max(0, Math.min(1, t));
  
        const x = start.x + (end.x - start.x) * t;
        const y = start.y + (end.y - start.y) * t;
        const z = start.z + (end.z - start.z) * t;

        return new Vector3(x, y, z);
    }

   
    public static fromArray(array: Array<number>){
        return new Vector3(array[0], array[1],array[2])
    }

    toArray(): number[] {
        return [this.x, this.y, this.z];
    }

    distanceTo(other: Vector3): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
    public static squaredDistance(a: Vector3, b: Vector3): number {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dz = a.z - b.z;
        return dx * dx + dy * dy + dz * dz;
    }

    public static increment(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x += b.x, a.y += b.y, a.z += b.z);
    }

    public static decrement(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x -= b.x, a.y -= b.y, a.z -= b.z);
    }

    public toString(): string {
        return `Vec3(${this.x.toFixed(2)}, ${this.y.toFixed(2)}, ${this.z.toFixed(2)})`;
    }
    

    public static add(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    public static subtract(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
    }

    public static scale(v: Vector3, scalar: number): Vector3 {
        return new Vector3(v.x * scalar, v.y * scalar, v.z * scalar);
    }

    public static divideScalar(v: Vector3, scalar: number): Vector3 {
        if (scalar === 0) throw new Error("Division by zero");
        return new Vector3(v.x / scalar, v.y / scalar, v.z / scalar);
    }

    public static dot(a: Vector3, b: Vector3): number {
        return a.x * b.x + a.y * b.y + a.z * b.z;
    }

    public static magnitude(v: Vector3): number {
        return Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
    }

    public length(){
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public normalize(epsilon: number = 1e-6): this{
        const length = this.length();
        if (length < epsilon) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        }

        this.x /= length;
        this.y /= length;
        this.z /= length;
        
        return this;
    }

    public static normalize(v: Vector3): Vector3 {
        const len = Vector3.magnitude(v);
        if (len === 0) return new Vector3();
        return Vector3.divideScalar(v, len);
    }

    public static cross(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    }


    public negativeY(){
        this.y = -this.y;

        return this;
    }

    public static negate(v: Vector3): Vector3 {
        return new Vector3(-v.x, -v.y, -v.z);
    }

    public static toString(v: Vector3): string {
        return `Vec3(${v.x}, ${v.y}, ${v.z})`;
    }

    public static arrayToF32Array(v: Vector3[]): Float32Array {
        const float32Array = new Float32Array(v.length * 3);
        for (let i = 0; i < v.length; i++) {
            float32Array[i * 3] = v[i].x;
            float32Array[i * 3 + 1] = v[i].y;
            float32Array[i * 3 + 2] = v[i].z;
        }
        return float32Array;
    }

    static distance(v1: Vector3, v2: Vector3): number {
        const dx = v1.x - v2.x;
        const dy = v1.y - v2.y;
        const dz = v1.z - v2.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }



    public static fromF32Array(data: Float32Array): Vector3[] {
        const vectors: Vector3[] = [];
        for (let i = 0; i < data.length; i += 3) {
            vectors.push(new Vector3(data[i], data[i + 1], data[i + 2]));
        }
        return vectors;
    }

    static min(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(Math.min(a.x, b.x), Math.min(a.y, b.y), Math.min(a.z, b.z));
    }
    
    static max(a: Vector3, b: Vector3): Vector3 {
        return new Vector3(Math.max(a.x, b.x), Math.max(a.y, b.y), Math.max(a.z, b.z));
    }
    
    
    public static applyMin(v: Vector3, minValue: number): Vector3 {
        return new Vector3(
            Math.max(v.x, minValue),
            Math.max(v.y, minValue),
            Math.max(v.z, minValue)
        );
    }

    public static applyMax(v: Vector3, maxValue: number): Vector3 {
        return new Vector3(
            Math.min(v.x, maxValue),
            Math.min(v.y, maxValue),
            Math.min(v.z, maxValue)
        );
    }

    public get xyz() {
        return [this.x, this.y, this.z];
    }

    public static clamp(v: Vector3, min: Vector3, max: Vector3): Vector3 {
        return new Vector3(
            Math.max(min.x, Math.min(v.x, max.x)),
            Math.max(min.y, Math.min(v.y, max.y)),
            Math.max(min.z, Math.min(v.z, max.z))
        );
    }

    toFloat32Array(): Float32Array {
        return new Float32Array([this.x, this.y, this.z]);
    }

    
}
