
import Mathf from "./Mathf";
import Vector3 from "./Vector3";

export default class Quaternion {
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    public static get identity(): Quaternion {
        return new Quaternion(0, 0, 0, 1);
    }
    
    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1){
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }

    // experimental
    clone(): Quaternion {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }
    static random(): Quaternion {
        // Gera ângulos de Euler aleatórios
        const theta = Math.random() * 2 * Math.PI; // ângulo azimutal
        const phi = Math.random() * Math.PI; // ângulo polar

        // Converte os ângulos em coordenadas de um vetor unitário
        const x = Math.sin(phi) * Math.cos(theta);
        const y = Math.sin(phi) * Math.sin(theta);
        const z = Math.cos(phi);

        // O valor de w é calculado para garantir que o quaternion seja normalizado
        const w = Math.sqrt(1 - x * x - y * y - z * z);

        return new Quaternion(x, y, z, w).normalize();
    }

    normalize(): Quaternion {
        const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        return new Quaternion(this.x / length, this.y / length, this.z / length, this.w / length);
    }

    multiply(q: Quaternion): Quaternion {
        const x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
        const y = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x;
        const z = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;
        const w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;

        return new Quaternion(x, y, z, w).normalize(); // Retorna o resultado normalizado
    }

    multiplyScalar(s: number): Quaternion {
        const x = this.x * s;
        const y = this.y * s;
        const z = this.z * s;
        const w = this.w * s;
    
        return new Quaternion(x, y, z, w).normalize(); // Retorna o resultado normalizado
    }
    
    //exp
    

    public static fromEulerAngles(vector: Vector3): Quaternion {
        const rollRad = Mathf.degToRad(vector.x) * 0.5;
        const pitchRad = Mathf.degToRad(vector.y) * 0.5;
        const yawRad = Mathf.degToRad(vector.z) * 0.5;
 
        const sinRoll = Mathf.sin(rollRad);
        const cosRoll = Mathf.cos(rollRad);
        const sinPitch = Mathf.sin(pitchRad);
        const cosPitch = Mathf.cos(pitchRad);
        const sinYaw = Mathf.sin(yawRad);
        const cosYaw = Mathf.cos(yawRad);
    
        const x = cosPitch * sinRoll * cosYaw - cosRoll * sinPitch * sinYaw;
        const y = cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw;
        const z = cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw;
        const w = cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw;
    
        return new Quaternion(x, y, z, w);
    }

    public static toEulerAngles(quaternion: Quaternion): Vector3 {
        const { x, y, z, w } = quaternion;
    
        // Roll (X-axis rotation)
        const sinr_cosp = 2 * (w * x + y * z);
        const cosr_cosp = 1 - 2 * (x * x + y * y);
        const roll = Math.atan2(sinr_cosp, cosr_cosp);
    
        // Pitch (Y-axis rotation)
        const sinp = 2 * (w * y - z * x);
        let pitch;
        if (Math.abs(sinp) >= 1)
            pitch = Math.sign(sinp) * Math.PI / 2; // use 90 degrees if out of range
        else
            pitch = Math.asin(sinp);
    
        // Yaw (Z-axis rotation)
        const siny_cosp = 2 * (w * z + x * y);
        const cosy_cosp = 1 - 2 * (y * y + z * z);
        const yaw = Math.atan2(siny_cosp, cosy_cosp);
    
        // Converte de radianos para graus, se necessário
        return new Vector3(
            Mathf.radToDeg(roll),
            Mathf.radToDeg(pitch),
            Mathf.radToDeg(yaw)
        );
    }
    

    static createRotationAxis(axis: Vector3, speed: number): Quaternion {
        // Normaliza o eixo de rotação
        const normalizedAxis = axis.normalize();

        // Calcula o ângulo em radianos
        const angle = speed; // ou speed * deltaTime, dependendo do contexto

        // Calcula o half-angle
        const halfAngle = angle / 2;

        // Cálculo dos componentes do quaternion
        const sinHalfAngle = Math.sin(halfAngle);
        const cosHalfAngle = Math.cos(halfAngle);

        const x = normalizedAxis.x * sinHalfAngle;
        const y = normalizedAxis.y * sinHalfAngle;
        const z = normalizedAxis.z * sinHalfAngle;
        const w = cosHalfAngle;

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



    //--------------TESTADOS E OTIMIZADOS-----------------------------------------
   
    public static dot(a: Quaternion, b: Quaternion): number {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    }
   
    public static length(quat: Quaternion): number {
        return Math.sqrt(Quaternion.dot(quat, quat));
    }
    
    public static normalize(quat: Quaternion, epsilon: number = 1e-6): Quaternion {
        const length = Quaternion.length(quat);
        if (length < epsilon) {
            return Quaternion.identity;
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

    public multiplyVector3(v: Vector3): Vector3 {
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
    
    multiplyQuat(q: Quaternion): this {
        const x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
        const y = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x;
        const z = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;
        const w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;
    
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    
        return this;
    }
    

    public toVec3(){
        return new Vector3(this.x, this.y, this.z);
    }
}
