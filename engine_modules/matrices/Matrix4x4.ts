import Mathf from "../../src/Base/Mathf/Mathf";
import Quaternion from "../vectors/Quaternion";
import Vector3 from "../vectors/Vector3";
import Vector4 from "../vectors/Vector4";

export default class Matrix4x4 {
    private _data: Float32Array;

    constructor(
        m00: number, m01: number, m02: number, m03: number,
        m10: number, m11: number, m12: number, m13: number,
        m20: number, m21: number, m22: number, m23: number,
        m30: number, m31: number, m32: number, m33: number
    ) {
        this._data = new Float32Array([
            m00, m01, m02, m03,
            m10, m11, m12, m13,
            m20, m21, m22, m23,
            m30, m31, m32, m33
        ]);
    }

    public static identity(): Matrix4x4 {
        return new Matrix4x4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            0, 0, 0, 1
        );
    }

    public clone(): Matrix4x4 {
        return new Matrix4x4(
            this._data[0], this._data[1], this._data[2], this._data[3],
            this._data[4], this._data[5], this._data[6], this._data[7],
            this._data[8], this._data[9], this._data[10], this._data[11],
            this._data[12], this._data[13], this._data[14], this._data[15]
        );
    }

    public removeTranslation(): Matrix4x4 {
       
        const clonedMatrix = this.clone();
        clonedMatrix._data[12] = 0; // Translação em x
        clonedMatrix._data[13] = 0; // Translação em y
        clonedMatrix._data[14] = 0; // Translação em z
        return clonedMatrix;
    }

    public static translate(t: Vector3): Matrix4x4 {
        return new Matrix4x4(
            1, 0, 0, 0,
            0, 1, 0, 0,
            0, 0, 1, 0,
            t.x, t.y, t.z, 1
        );
    }

    public static shadowMapping(projectionMatrix: Matrix4x4, viewMatrix: Matrix4x4) {
        return Matrix4x4.multiply(projectionMatrix, viewMatrix);
    }

    public static createRotationMatrix(rotation: Quaternion): Matrix4x4 {
        const xx = rotation.x * 2;
        const yy = rotation.y * 2;
        const zz = rotation.z * 2;
        const x_xx = rotation.x * xx;
        const y_yy = rotation.y * yy;
        const z_zz = rotation.z * zz;
        const x_yy = rotation.x * yy;
        const x_zz = rotation.x * zz;
        const y_zz = rotation.y * zz;
        const w_xx = rotation.w * xx;
        const w_yy = rotation.w * yy;
        const w_zz = rotation.w * zz;
    
        return new Matrix4x4(
            1 - (y_yy + z_zz), x_yy + w_zz, x_zz - w_yy, 0,
            x_yy - w_zz, 1 - (x_xx + z_zz), y_zz + w_xx, 0,
            x_zz + w_yy, y_zz - w_xx, 1 - (x_xx + y_yy), 0,
            0, 0, 0, 1
        );
    }

    public static createScaleMatrix(s: Vector3){
        return new Matrix4x4(
            s.x, 0, 0, 0,
            0, s.y, 0, 0,
            0, 0, s.z, 0,
            0, 0, 0, 1
        );
    }

   
    public static lookTo(position: Vector3, direction: Vector3, up: Vector3): Matrix4x4 {
    
        const zAxis = direction.normalize().negative();
        const xAxis = up.cross(zAxis).normalize();
        const yAxis = zAxis.cross(xAxis).normalize();
    
        const lookToMatrix = new Matrix4x4(
            xAxis.x, yAxis.x, zAxis.x, 0,
            xAxis.y, yAxis.y, zAxis.y, 0,
            xAxis.z, yAxis.z, zAxis.z, 0,
            -xAxis.dot(position), -yAxis.dot(position), -zAxis.dot(position), 1
        );
    
        return lookToMatrix;
    }

    public static lookAt(eye: Vector3, target: Vector3, up: Vector3): Matrix4x4 {
        
        const zAxis = Vector3.normalize(Vector3.subtract(eye, target));  
        const xAxis = Vector3.normalize(Vector3.cross(up, zAxis));
        const yAxis = Vector3.normalize(Vector3.cross(zAxis, xAxis));
    
        const lookAtMatrix = new Matrix4x4(
            xAxis.x, yAxis.x, zAxis.x, 0,
            xAxis.y, yAxis.y, zAxis.y, 0,
            xAxis.z, yAxis.z, zAxis.z, 0,
            -Vector3.dot(xAxis, eye),
            -Vector3.dot(yAxis, eye),
            -Vector3.dot(zAxis, eye),
            1
        );
    
        return lookAtMatrix;
    }

    public static perspective(fov: number, aspectRatio: number, nearPlane: number, farPlane: number): Matrix4x4 {
        const tanHalfFov = Mathf.tan(Mathf.degToRad(fov) / 2);
        const range = farPlane - nearPlane;
   
        return new Matrix4x4(
            1 / (aspectRatio * tanHalfFov), 0, 0, 0,
            0, 1 / tanHalfFov, 0, 0,
            0, 0, -(farPlane + nearPlane) / range, -1,
            0, 0, -2 * (farPlane * nearPlane) / range, 0
        );
    }

    public static orthographic(left: number, right: number, bottom: number, top: number, nearPlane: number, farPlane: number): Matrix4x4 {
        const width = right - left;
        const height = top - bottom;
        const depth = farPlane - nearPlane;

        return new Matrix4x4(
            2 / width, 0, 0, 0,
            0, 2 / height, 0, 0,
            0, 0, -2 / depth, 0,
            - (right + left) / width, - (top + bottom) / height, - (farPlane + nearPlane) / depth, 1
        );
    }
    
    public static multiply(lhs: Matrix4x4, rhs: Matrix4x4): Matrix4x4 {
        const result = Matrix4x4.identity();
        const a = lhs.getData();
        const b = rhs.getData();
        const r = result.getData();
    
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                r[i * 4 + j] = a[i * 4] * b[j] +
                               a[i * 4 + 1] * b[j + 4] +
                               a[i * 4 + 2] * b[j + 8] +
                               a[i * 4 + 3] * b[j + 12];
            }
        }
    
        return result;
    }

    public static transpose(m: Matrix4x4): Matrix4x4 {
        const result = Matrix4x4.identity();
        const data = m.getData();
        const r = result.getData();

        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 4; j++) {
                r[i * 4 + j] = data[j * 4 + i];
            }
        }

        return result;
    }
    
    public static inverse(m: Matrix4x4): Matrix4x4 {
        const data = m.getData();
        const identity = Matrix4x4.identity().getData();
        const matrix = new Float32Array(data);
       
        for (let i = 0; i < 4; i++) {
            
            let pivotIndex = i;
            let maxVal = Math.abs(matrix[i * 4 + i]);
    
            for (let j = i + 1; j < 4; j++) {
                const val = Math.abs(matrix[j * 4 + i]);
                if (val > maxVal) {
                    maxVal = val;
                    pivotIndex = j;
                }
            }
    
            if (pivotIndex !== i) {
                for (let k = 0; k < 4; k++) {
                    const temp = matrix[i * 4 + k];
                    matrix[i * 4 + k] = matrix[pivotIndex * 4 + k];
                    matrix[pivotIndex * 4 + k] = temp;
    
                    const tempIdentity = identity[i * 4 + k];
                    identity[i * 4 + k] = identity[pivotIndex * 4 + k];
                    identity[pivotIndex * 4 + k] = tempIdentity;
                }
            }
    
            const pivotValue = matrix[i * 4 + i];
            if (pivotValue === 0) {
                console.error("A matriz não é inversível");
                return Matrix4x4.identity(); 
            }
    
            for (let j = 0; j < 4; j++) {
                matrix[i * 4 + j] /= pivotValue;
                identity[i * 4 + j] /= pivotValue;
            }
    
            for (let j = 0; j < 4; j++) {
                if (j !== i) {
                    const factor = matrix[j * 4 + i];
                    for (let k = 0; k < 4; k++) {
                        matrix[j * 4 + k] -= factor * matrix[i * 4 + k];
                        identity[j * 4 + k] -= factor * identity[i * 4 + k];
                    }
                }
            }
        }
    
        return new Matrix4x4(
            identity[0], identity[1], identity[2], identity[3],
            identity[4], identity[5], identity[6], identity[7],
            identity[8], identity[9], identity[10], identity[11],
            identity[12], identity[13], identity[14], identity[15]
        );
    }

    public inverse(): Matrix4x4 {
       return Matrix4x4.inverse(this);
    }
    
    public static createModelMatrix(translation: Vector3, rotation: Quaternion, scale: Vector3): Matrix4x4 {
        const xx = rotation.x * 2;
        const yy = rotation.y * 2;
        const zz = rotation.z * 2;
        const x_xx = rotation.x * xx;
        const y_yy = rotation.y * yy;
        const z_zz = rotation.z * zz;
        const x_yy = rotation.x * yy;
        const x_zz = rotation.x * zz;
        const y_zz = rotation.y * zz;
        const w_xx = rotation.w * xx;
        const w_yy = rotation.w * yy;
        const w_zz = rotation.w * zz;
    
        return new Matrix4x4(
            (1 - (y_yy + z_zz)) * scale.x, (x_yy + w_zz) * scale.y, (x_zz - w_yy) * scale.z, 0,
            (x_yy - w_zz) * scale.x, (1 - (x_xx + z_zz)) * scale.y, (y_zz + w_xx) * scale.z, 0,
            (x_zz + w_yy) * scale.x, (y_zz - w_xx) * scale.y, (1 - (x_xx + y_yy)) * scale.z, 0,
            translation.x, translation.y, translation.z, 1
        );
    }

    public multiplyVec4(vec: Vector4): Vector4 {
        const a = this.getData();
        const x = vec.x, y = vec.y, z = vec.z, w = vec.w;
        return new Vector4(
            a[0] * x + a[4] * y + a[8] * z + a[12] * w,
            a[1] * x + a[5] * y + a[9] * z + a[13] * w,
            a[2] * x + a[6] * y + a[10] * z + a[14] * w,
            a[3] * x + a[7] * y + a[11] * z + a[15] * w
        );
    }
    
    public multiplyVec3(vec: Vector3): Vector3 {
        
        const vec4 = new Vector4(vec.x, vec.y, vec.z, 1.0);
        const result4 = this.multiplyVec4(vec4);
        return new Vector3(result4.x, result4.y, result4.z);
    }

    
    public getData(): Float32Array {
        return this._data;
    }

   public toString(): string {
    const data = this.getData();
    let result = '';

    // Encontre o comprimento máximo necessário para formatação
    const maxLength = Math.max(...data.map(num => this.formatNumber(num).length));

    for (let i = 0; i < 4; i++) {
        result += `[${this.formatNumber(data[i * 4]).padStart(maxLength, ' ')}, ${this.formatNumber(data[i * 4 + 1]).padStart(maxLength, ' ')}, ${this.formatNumber(data[i * 4 + 2]).padStart(maxLength, ' ')}, ${this.formatNumber(data[i * 4 + 3]).padStart(maxLength, ' ')}]\n`;
    }

    return result;
}

private formatNumber(value: number): string {
    // Formate o número com dois dígitos decimais
    const formatted = value.toFixed(2);
    // Adicione sinal + para números positivos e mantenha o sinal para negativos
    return value >= 0 ? `+${formatted}` : formatted;
}
}
