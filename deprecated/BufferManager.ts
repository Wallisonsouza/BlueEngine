// import Matrix4x4 from "../math/Matrix4x4";
// import Engine from "../engine";
// import Camera from "../components/Camera";

// export class BufferManager {
//     private static meshBuffers: Map<number, WebGLVertexArrayObject | null> = new Map();
//     private static cameraBuffers: Map<number, WebGLBuffer> = new Map();

    
//     public static getMeshBuffer(id: number) {
//         return this.meshBuffers.get(id) ?? null;
//     }


//     private static matrixOffsets: Map<string, number> = new Map([
//         ['view', 0],
//         ['projection', 16 * Float32Array.BYTES_PER_ELEMENT]
//     ]);
    
//     public static updateCameraBuffer(matrixType: 'view' | 'projection' | string, matrix: Matrix4x4, camera: Camera) {
//         const gl = Engine.gl;
//         const mat4Size = Matrix4x4.BYTE_SIZE;
//         const bufferSize = 3 * mat4Size; 
    
//         let buffer = this.cameraBuffers.get(camera.id.value);
//         if (!buffer) {
//             buffer = gl.createBuffer();
//             this.cameraBuffers.set(camera.id.value, buffer);
    
//             gl.bindBuffer(gl.UNIFORM_BUFFER, buffer);
//             gl.bufferData(gl.UNIFORM_BUFFER, bufferSize, gl.DYNAMIC_DRAW);
//         }
    
//         // Verifica se a chave já existe no Map
//         if (!this.matrixOffsets.has(matrixType)) {
//             console.error(`Tipo de matriz inválido: ${matrixType}`);
//             return;
//         }
    
//         const offset = this.matrixOffsets.get(matrixType)!;
    
//         gl.bufferSubData(gl.UNIFORM_BUFFER, offset, matrix.getData());
//     }
    

//     public static getCameraBuffer(id: number): WebGLBuffer | null {
//         return this.cameraBuffers.get(id) ?? null;
//     }
   
// }
