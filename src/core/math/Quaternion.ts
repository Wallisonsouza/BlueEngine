import Mathf from "./Mathf";
import Vector3 from "./Vector3";



export default class Quaternion {
    public x: number;
    public y: number;
    public z: number;
    public w: number;

    public static readonly IDENTITY = new Quaternion(0, 0, 0, 1);

    constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 1) {
        this.x = x;
        this.y = y;
        this.z = z;
        this.w = w;
    }


    public getRadians(): Vector3 {
        // Calculando a rotação sobre o eixo Z (roll), Y (pitch) e X (yaw)
        const sinr_cosp = 2 * (this.w * this.x + this.y * this.z);
        const cosr_cosp = 1 - 2 * (this.x * this.x + this.y * this.y);
        const roll = Math.atan2(sinr_cosp, cosr_cosp);  // Roll (Z axis rotation)

        const sinp = 2 * (this.w * this.y - this.z * this.x);
        const pitch = Math.asin(Math.max(-1, Math.min(1, sinp)));  // Pitch (Y axis rotation)

        const siny_cosp = 2 * (this.w * this.z + this.x * this.y);
        const cosy_cosp = 1 - 2 * (this.y * this.y + this.z * this.z);
        const yaw = Math.atan2(siny_cosp, cosy_cosp);  // Yaw (X axis rotation)

        return new Vector3(roll, pitch, yaw);  // Retorna os ângulos de Euler em um vetor (roll, pitch, yaw)
    }
    











    //#region Static methods

    public static dot(a: Quaternion, b: Quaternion): number {
        return a.x * b.x + a.y * b.y + a.z * b.z + a.w * b.w;
    }

    public static conjugate(quat: Quaternion): Quaternion {
        return new Quaternion(-quat.x, -quat.y, -quat.z, quat.w);
    }

    public static divideByScalar(quat: Quaternion, scalar: number): Quaternion {

        if (scalar === 0) {
            throw new Error("Divisão por zero não é permitida.");
        }
        return new Quaternion(quat.x / scalar, quat.y / scalar, quat.z / scalar, quat.w / scalar);
    }

    public static inverse(quat: Quaternion): Quaternion {

        const normSq = Quaternion.dot(quat, quat);

        if (normSq === 0) {
            throw new Error("O inverso não pode ser calculado para um quaternion com norma zero.");
        }

        const conjugate = Quaternion.conjugate(quat);
        return Quaternion.divideByScalar(conjugate, normSq);

    }

    public static multiplyVector3(q: Quaternion, v: Vector3) {
        const vecQuat = new Quaternion(v.x, v.y, v.z, 0);

        const resultQuat = Quaternion.multiplyQuat(q, vecQuat);

        const finalQuat = Quaternion.multiplyQuat(resultQuat, Quaternion.conjugate(q));

        return new Vector3(finalQuat.x, finalQuat.y, finalQuat.z);
    }

    //#endregion

    //#region Instance methods

    public dot(other: Quaternion): number {
        return Quaternion.dot(this, other);
    }

    public conjugate(): Quaternion {
        return Quaternion.conjugate(this);
    }

    public divideByScalar(scalar: number): Quaternion {
        return Quaternion.divideByScalar(this, scalar);
    }

    public inverse(): Quaternion {
        return Quaternion.inverse(this);
    }

    public multiplyVector3(v: Vector3): Vector3 {
        return Quaternion.multiplyVector3(this, v);
    }

    public transformVector3(vector: Vector3) {
        return Quaternion.multiplyVector3(this, vector);
    }

    //#endregion


    //#region InPlace

    public static multiplyVector3InPlace(q: Quaternion, v: Vector3): Vector3 {
        // Armazena os componentes do vetor e do quaternion
        const vx = v.x, vy = v.y, vz = v.z;
        const qw = q.w, qx = q.x, qy = q.y, qz = q.z;
    
        // Calcula o produto q * vecQuat (onde vecQuat é o vetor representado como quaternion)
        const ix = qw * vx + qy * vz - qz * vy;
        const iy = qw * vy + qz * vx - qx * vz;
        const iz = qw * vz + qx * vy - qy * vx;
        const iw = -qx * vx - qy * vy - qz * vz;
    
        // Calcula o produto resultQuat * conjugate(q)
        v.x = ix * qw - iw * qx + iy * qz - iz * qy;
        v.y = iy * qw - iw * qy + iz * qx - ix * qz;
        v.z = iz * qw - iw * qz + ix * qy - iy * qx;
    
        return v; // Retorna o vetor transformado
    }

    // experimental
    clone(): Quaternion {
        return new Quaternion(this.x, this.y, this.z, this.w);
    }
    public equals(other: Quaternion): boolean {
        return this.x === other.x && this.y === other.y && this.z === other.z && this.w === other.w;
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

        return new Quaternion(x, y, z, w).normalized();
    }

    normalized(): Quaternion {
        const length = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
        return new Quaternion(this.x / length, this.y / length, this.z / length, this.w / length);
    }

    multiply(q: Quaternion): Quaternion {
        const x = this.w * q.x + this.x * q.w + this.y * q.z - this.z * q.y;
        const y = this.w * q.y - this.x * q.z + this.y * q.w + this.z * q.x;
        const z = this.w * q.z + this.x * q.y - this.y * q.x + this.z * q.w;
        const w = this.w * q.w - this.x * q.x - this.y * q.y - this.z * q.z;

        return new Quaternion(x, y, z, w).normalized(); // Retorna o resultado normalizado
    }

    multiplyScalar(s: number): Quaternion {
        const x = this.x * s;
        const y = this.y * s;
        const z = this.z * s;
        const w = this.w * s;

        return new Quaternion(x, y, z, w).normalized(); // Retorna o resultado normalizado
    }

    //exp


    public static fromEulerAnglesVector3(vector: Vector3): Quaternion {
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

    public static eulerNumber(angleX: number, angleY: number, angleZ: number): Quaternion {
        // Converte os ângulos de Euler (yaw, pitch, roll) de graus para radianos
        const rollRad = Mathf.degToRad(angleX) * 0.5;
        const pitchRad = Mathf.degToRad(angleY) * 0.5;
        const yawRad = Mathf.degToRad(angleZ) * 0.5;
    
        // Calcula os senos e cossenos dos ângulos
        const sinRoll = Mathf.sin(rollRad);
        const cosRoll = Mathf.cos(rollRad);
        const sinPitch = Mathf.sin(pitchRad);
        const cosPitch = Mathf.cos(pitchRad);
        const sinYaw = Mathf.sin(yawRad);
        const cosYaw = Mathf.cos(yawRad);
    
        // Calcula os componentes do quaternion a partir dos ângulos de Euler
        const x = cosPitch * sinRoll * cosYaw - cosRoll * sinPitch * sinYaw;
        const y = cosRoll * sinPitch * cosYaw + sinRoll * cosPitch * sinYaw;
        const z = cosRoll * cosPitch * sinYaw - sinRoll * sinPitch * cosYaw;
        const w = cosRoll * cosPitch * cosYaw + sinRoll * sinPitch * sinYaw;
    
        // Retorna o quaternion calculado
        return new Quaternion(x, y, z, w);
    }
    
    public static toEulerAngles(quaternion: Quaternion): Vector3 {
        const { x, y, z, w } = quaternion.normalized();

        const sinRoll = Mathf.clamp(2 * (w * x + y * z), -1, 1);
        const cosRoll = Mathf.clamp(1 - 2 * (x * x + y * y), -1, 1);
        let roll = Math.atan2(sinRoll, cosRoll); // X (roll)

        const sinPitch = 2 * (w * y - z * x);
        let pitch = Math.asin(Mathf.clamp(sinPitch, -1, 1)); // Y (pitch)

        const sinYaw = 2 * (w * z + x * y);
        const cosYaw = 1 - 2 * (y * y + z * z);
        let yaw = Math.atan2(sinYaw, cosYaw); // Z (yaw)

        // Ajustando para garantir que o valor esteja no intervalo -π a π
        if (roll > Math.PI) roll -= 2 * Math.PI;
        if (roll < -Math.PI) roll += 2 * Math.PI;
        if (pitch > Math.PI) pitch -= 2 * Math.PI;
        if (pitch < -Math.PI) pitch += 2 * Math.PI;
        if (yaw > Math.PI) yaw -= 2 * Math.PI;
        if (yaw < -Math.PI) yaw += 2 * Math.PI;

        return new Vector3(
            Mathf.radToDeg(roll),  // Converte radianos para graus
            Mathf.radToDeg(pitch), // Converte radianos para graus
            Mathf.radToDeg(yaw)    // Converte radianos para graus
        );
    }




    static createRotationAxis(axis: Vector3, angle: number): Quaternion {
        const normalizedAxis = axis.normalize();
        const halfAngle = angle / 2;

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


    public static magnitude(quat: Quaternion): number {
        return Math.sqrt(Quaternion.dot(quat, quat));
    }

    public static normalize(quat: Quaternion, epsilon: number = 1e-6): Quaternion {
        const length = Quaternion.magnitude(quat);
        if (length < epsilon) {
            return Quaternion.IDENTITY;
        }

        const invNorm = 1 / length;
        return Quaternion.multiplyScalar(quat, invNorm);
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

  

   
    //--------------TESTADOS E OTIMIZADOS-----------------------------------------


    public static negate(q: Quaternion): Quaternion {
        return new Quaternion(-q.x, -q.y, -q.z, -q.w);
    }

    public static fromArray(array: Array<number>) {
        return new Quaternion(array[0], array[1], array[2], array[3])
    }
    public static toArray(q: Quaternion) {
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


    public toVec3() {
        return new Vector3(this.x, this.y, this.z);
    }

    public toArray() {
        return [this.x, this.y, this.z, this.w];
    }
    public get wxyz() {
        return [this.x, this.y, this.z, this.w];
    }

    toString() {
        return `Quat(${this.x}, ${this.y}, ${this.z}, ${this.w})`
    }
}