
import Mathf from "../../src/Base/Mathf/Mathf";
import Vector3 from "./Vector3";

export default class Quaternion {
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    public static get identity(): Quaternion {
        return new Quaternion(0, 0, 0, 1);
    }
    
    public static readonly zero = new Quaternion(0, 0, 0, 0)
    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1){
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }
  

    public static fromEulerAngles(vector: Vector3): Quaternion {
        // Convertendo ângulos de graus para radianos
        const rollRad = Mathf.degToRad(vector.x) * 0.5;
        const pitchRad = Mathf.degToRad(vector.y) * 0.5;
        const yawRad = Mathf.degToRad(vector.z) * 0.5;
    
        // Calculando os senos e cossenos
        const sinRoll = Mathf.sin(rollRad);
        const cosRoll = Mathf.cos(rollRad);
        const sinPitch = Mathf.sin(pitchRad);
        const cosPitch = Mathf.cos(pitchRad);
        const sinYaw = Mathf.sin(yawRad);
        const cosYaw = Mathf.cos(yawRad);
    
        // Calculando os componentes do quaternion
        const x = cosPitch * sinRoll * cosYaw - cosRoll * sinPitch * sinYaw;
        const y = cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw;
        const z = cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw;
        const w = cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw;
    
        // Retornando o quaternion
        return new Quaternion(x, y, z, w);
    }
    public static slerp(a: Quaternion, b: Quaternion, t: number): Quaternion {
        let dot = Quaternion.dot(a, b);

        // If the dot product is negative, reverse one quaternion to take the shorter path
        if (dot < 0.0) {
            b = Quaternion.negate(b);
            dot = -dot;
        }

        const DOT_THRESHOLD = 0.9995;
        if (dot > DOT_THRESHOLD) {
            const result = Quaternion.add(a, Quaternion.multiplyScalar(Quaternion.subtract(b, a), t));
            return Quaternion.normalize(result);
        }

        dot = Mathf.clamp(dot, -1.0, 1.0);
        const theta_0 = Mathf.acos(dot);
        const theta = theta_0 * t;
        const relative = Quaternion.normalize(Quaternion.subtract(b, Quaternion.multiplyScalar(a, dot)));

        return Quaternion.add(Quaternion.multiplyScalar(a, Mathf.cos(theta)), Quaternion.multiplyScalar(relative, Mathf.sin(theta)));
    }

    public static dot(a: Quaternion, b: Quaternion): number {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    }
    



    //--------------TESTADOS E OTIMIZADOS-----------------------------------------
    public static length(quat: Quaternion): number {
        return Math.sqrt(quat.x * quat.x + quat.y * quat.y + quat.z * quat.z + quat.w * quat.w);
    }
    
    public static normalize(quat: Quaternion, epsilon: number = 1e-6): Quaternion {
        const length = Quaternion.length(quat);
        if (length < epsilon) {
            return new Quaternion(0, 0, 0, 1);
        }

        const invNorm = 1 / length;
        return Quaternion.multiplyScalar(quat, invNorm);
    }

    public static conjugate(quat: Quaternion): Quaternion {
        return new Quaternion(-quat.x, -quat.y, -quat.z, quat.w);
    }

    public static multiplyScalar(q: Quaternion, s: number): Quaternion {
        return new Quaternion(
            q.x * s,
            q.y * s,
            q.z * s,
            q.w * s
        );
    }

    public static add(q1: Quaternion, q2: Quaternion): Quaternion {
        return new Quaternion(q1.x + q2.x, q1.y + q2.y, q1.z + q2.z, q1.w + q2.w);
    }

    public static subtract(q1: Quaternion, q2: Quaternion): Quaternion {
        return new Quaternion(q1.x - q2.x, q1.y - q2.y, q1.z - q2.z, q1.w - q2.w);
    }

    public static multiplyQuat(q1: Quaternion, q2: Quaternion): Quaternion {
        return new Quaternion(
            q1.w * q2.x + q1.x * q2.w + q1.y * q2.z - q1.z * q2.y, // x
            q1.w * q2.y - q1.x * q2.z + q1.y * q2.w + q1.z * q2.x, // y
            q1.w * q2.z + q1.x * q2.y - q1.y * q2.x + q1.z * q2.w, // z
            q1.w * q2.w - q1.x * q2.x - q1.y * q2.y - q1.z * q2.z  // w
        );
    }

    public static toVec3(q: Quaternion) {
        return new Vector3(q.x, q.y, q.z);
    }

    public static multiplyVec3(q: Quaternion, v: Vector3){
        const vecQuat = new Quaternion(v.x, v.y, v.z, 0);
    
        const resultQuat = Quaternion.multiplyQuat(q, vecQuat);
        
        const finalQuat = Quaternion.multiplyQuat(resultQuat, Quaternion.conjugate(q));
        
        return new Vector3(finalQuat.x, finalQuat.y, finalQuat.z);
    }

    public multiplyVec3(v: Vector3): Vector3 {
        return Quaternion.multiplyVec3(this, v);
    }
    //--------------TESTADOS E OTIMIZADOS-----------------------------------------

   
    public static inverse(quat: Quaternion): Quaternion {
        const normalized = Quaternion.normalize(quat);
        const invNorm = 1 / (normalized.x * normalized.x + normalized.y * normalized.y + normalized.z * normalized.z + normalized.w * normalized.w);
        
        return new Quaternion(
            -normalized.x * invNorm,
            -normalized.y * invNorm,
            -normalized.z * invNorm,
            normalized.w * invNorm
        );
    }

  
   

    public static negate(q: Quaternion): Quaternion {
        return new Quaternion(-q.x, -q.y, -q.z, -q.w);
    }

    public static fromArray(array: Array<number>){
        return new Quaternion(array[0], array[1], array[2], array[3])
    }
    public static toArray(q: Quaternion){
        return [q.x, q.y, q.z, q.w]
    }

   
    static multiplyVec3Mat(quaternion: Quaternion, vector: Vector3): Vector3 {
        const num00 = quaternion.x * 2;
        const num01 = quaternion.y * 2;
        const num03 = quaternion.z * 2;
        const num04 = quaternion.x * num00;
        const num05 = quaternion.y * num01;
        const num06 = quaternion.z * num03;
        const num07 = quaternion.x * num01;
        const num08 = quaternion.x * num03;
        const num09 = quaternion.y * num03;
        const num10 = quaternion.w * num00;
        const num11 = quaternion.w * num01;
        const num12 = quaternion.w * num03;

        const right = new Vector3(
            1 - (num05 + num06),
            num07 - num12,
            num08 + num11
        );

        const up = new Vector3(
            num07 + num12,
            1 - (num04 + num06),
            num09 - num10
        );

        const forward = new Vector3(
            num08 - num11,
            num09 + num10,
            1 - (num04 + num05)
        );

        return new Vector3(
            Vector3.dot(vector, right),
            Vector3.dot(vector, up),
            Vector3.dot(vector, forward)
        );
    }
    
    multiplyQuat(q: Quaternion): Quaternion {
        return new Quaternion(
            this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y,
            this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x,
            this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w,
            this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z
        );
    }

    public toVec3(){
        return new Vector3(this.x, this.y, this.z);
    }
}
