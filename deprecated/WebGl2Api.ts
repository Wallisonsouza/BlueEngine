// import { ShaderError } from "../../Error";
// import { IRenderingApi } from "../../../../deprecated/global";

// function handleBufferCreationError(
//     methodName: string,
//     target: number,
//     usage: number,
//     error: unknown
// ): never {
//     const originalError = error instanceof Error ? error : new Error(String(error));
//     throw new ShaderError(
//         methodName,
//         target,
//         usage,
//         "Ocorreu um erro durante a criação do buffer.",
//         originalError
//     );
// }
// export class WebGL2Api implements IRenderingApi {
//     public context: WebGL2RenderingContext;

//     constructor(gl: WebGL2RenderingContext) {
//         this.context = gl;
//     }

//     private createGpuBuffer(
//         data: Float32Array | Uint16Array | null,
//         target: number,
//         usage: number
//     ): WebGLBuffer | null {
//         if (!data) {
//             throw new ShaderError(
//                 "createBuffer",
//                 target,
//                 usage,
//                 "Os dados fornecidos são nulos ou inválidos ao tentar criar um buffer. Verifique se os dados foram inicializados corretamente."
//             );
//         }
    
//         const buffer = this.context.createBuffer();
//         if (!buffer) {
//             throw new ShaderError(
//                 "createBuffer",
//                 target,
//                 usage,
//                 "A criação do buffer WebGL falhou. Isso pode ser devido à falta de memória ou ao contexto WebGL estar corrompido."
//             );
//         }
    
//         this.context.bindBuffer(target, buffer);
//         this.context.bufferData(target, data, usage);
//         return buffer;
//     }
    
    
//     createVertexBuffer(data: Float32Array | null): WebGLBuffer | null {
//         try {
//             return this.createGpuBuffer(data, this.context.ARRAY_BUFFER, this.context.STATIC_DRAW);
//         } catch (error) {
//             handleBufferCreationError("createVertexBuffer", this.context.ARRAY_BUFFER, this.context.STATIC_DRAW, error);
//         }
//     }

//     createViewBuffer(data: Float32Array | null): WebGLBuffer | null {
//         try {
//             return this.createGpuBuffer(data, this.context.ARRAY_BUFFER, this.context.DYNAMIC_DRAW);
//         } catch (error) {
//             handleBufferCreationError("createVertexBuffer", this.context.ARRAY_BUFFER, this.context.DYNAMIC_DRAW, error);
//         }
//     }
    
//     createIndexBuffer(data: Uint16Array | null): WebGLBuffer | null {
//         try {
//             return this.createGpuBuffer(data, this.context.ELEMENT_ARRAY_BUFFER, this.context.STATIC_DRAW);
//         } catch (error) {
//             handleBufferCreationError("createIndexBuffer", this.context.ELEMENT_ARRAY_BUFFER, this.context.STATIC_DRAW, error);
//         }
//     }
    
//     createNormalBuffer(data: Float32Array | null): WebGLBuffer | null {
//         try {
//             return this.createGpuBuffer(data, this.context.ARRAY_BUFFER, this.context.STATIC_DRAW);
//         } catch (error) {
//             handleBufferCreationError("createNormalBuffer", this.context.ARRAY_BUFFER, this.context.STATIC_DRAW, error);
//         }
//     };
    
//     createUVBuffer(data: Float32Array | null): WebGLBuffer | null {
//         try {
//             return this.createGpuBuffer(data, this.context.ARRAY_BUFFER, this.context.STATIC_DRAW);
//         } catch (error) {
//             handleBufferCreationError("createUVBuffer", this.context.ARRAY_BUFFER, this.context.STATIC_DRAW, error);
//         }
//     }

//        createColorBuffer(data: Float32Array | null): WebGLBuffer | null {
//         try {
//             return this.createGpuBuffer(data, this.context.ARRAY_BUFFER, this.context.STATIC_DRAW);
//         } catch (error) {
//             handleBufferCreationError("createNormalBuffer", this.context.ARRAY_BUFFER, this.context.STATIC_DRAW, error);
//         }
//     }
    

//     getRenderInstance(): WebGL2RenderingContext {
//         return this.context;
//     }
// }
