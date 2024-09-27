import Matrix4x4 from "../../../engine_modules/matrices/Matrix4x4";
import Vector2 from "../../../engine_modules/vectors/Vector2";
import Vector3 from "../../../engine_modules/vectors/Vector3";
import { Vec3 } from "../../../engine_plugins/obj-looader/ObjRepresentation";
import Component from "../../components/Component";
import { IMeshBuffers, IMeshData, IRenderingApi } from "../../global";
import Entity from "../components/Entity";
import { ShaderError} from "../static/Error";
import ServiceLocator from "./ServiceLocator";


function handleBufferCreationError(
    methodName: string,
    target: number,
    usage: number,
    error: unknown
): never {
    const originalError = error instanceof Error ? error : new Error(String(error));
    throw new ShaderError(
        methodName,
        target,
        usage,
        "Ocorreu um erro durante a criação do buffer.",
        originalError
    );
}
export class WebGL2Api implements IRenderingApi {
    public context: WebGL2RenderingContext;

    constructor(gl: WebGL2RenderingContext) {
        this.context = gl;
    }

    public createBuffer(
        data: Float32Array | Uint16Array | null,
        target: number,
        usage: number
    ): WebGLBuffer | null {
        if (!data) {
            throw new ShaderError(
                "createBuffer",
                target,
                usage,
                "Os dados fornecidos são nulos ou inválidos ao tentar criar um buffer. Verifique se os dados foram inicializados corretamente."
            );
        }
    
        const buffer = this.context.createBuffer();
        if (!buffer) {
            throw new ShaderError(
                "createBuffer",
                target,
                usage,
                "A criação do buffer WebGL falhou. Isso pode ser devido à falta de memória ou ao contexto WebGL estar corrompido."
            );
        }
    
        this.context.bindBuffer(target, buffer);
        this.context.bufferData(target, data, usage);
        return buffer;
    }
    
    createVertexBuffer(data: Float32Array | null): WebGLBuffer | null {
        try {
            return this.createBuffer(data, this.context.ARRAY_BUFFER, this.context.STATIC_DRAW);
        } catch (error) {
            handleBufferCreationError("createVertexBuffer", this.context.ARRAY_BUFFER, this.context.STATIC_DRAW, error);
        }
    }

    createViewBuffer(data: Float32Array | null): WebGLBuffer | null {
        try {
            return this.createBuffer(data, this.context.ARRAY_BUFFER, this.context.DYNAMIC_DRAW);
        } catch (error) {
            handleBufferCreationError("createVertexBuffer", this.context.ARRAY_BUFFER, this.context.DYNAMIC_DRAW, error);
        }
    }
    
    createIndexBuffer(data: Uint16Array | null): WebGLBuffer | null {
        try {
            return this.createBuffer(data, this.context.ELEMENT_ARRAY_BUFFER, this.context.STATIC_DRAW);
        } catch (error) {
            handleBufferCreationError("createIndexBuffer", this.context.ELEMENT_ARRAY_BUFFER, this.context.STATIC_DRAW, error);
        }
    }
    
    createNormalBuffer(data: Float32Array | null): WebGLBuffer | null {
        try {
            return this.createBuffer(data, this.context.ARRAY_BUFFER, this.context.STATIC_DRAW);
        } catch (error) {
            handleBufferCreationError("createNormalBuffer", this.context.ARRAY_BUFFER, this.context.STATIC_DRAW, error);
        }
    }
    
    createUVBuffer(data: Float32Array | null): WebGLBuffer | null {
        try {
            return this.createBuffer(data, this.context.ARRAY_BUFFER, this.context.STATIC_DRAW);
        } catch (error) {
            handleBufferCreationError("createUVBuffer", this.context.ARRAY_BUFFER, this.context.STATIC_DRAW, error);
        }
    }

       createColorBuffer(data: Float32Array | null): WebGLBuffer | null {
        try {
            return this.createBuffer(data, this.context.ARRAY_BUFFER, this.context.STATIC_DRAW);
        } catch (error) {
            handleBufferCreationError("createNormalBuffer", this.context.ARRAY_BUFFER, this.context.STATIC_DRAW, error);
        }
    }

    createArrayBuffer(data: Float32Array[]): WebGLBuffer | null {
        
    }
    

    getRenderInstance(): WebGL2RenderingContext {
        return this.context;
    }
}

// export default class Mesh extends Entity implements IMeshData, IMeshBuffers {

//    vertices: Float32Array | null = null;
//    indices: Uint16Array | null = null;
//    normals: Float32Array | null = null;
//    uvs: Float32Array | null = null;
//    vertexBuffer: WebGLBuffer | null = null;
//    indexBuffer: WebGLBuffer | null = null;
//    normalBuffer: WebGLBuffer | null = null;
//    uvBuffer: WebGLBuffer | null = null;
//    colorBuffer: WebGLBuffer | null = null;

//    viewBuffer: WebGLBuffer | null = null;

//     constructor(vertices?: Float32Array, indices?: Uint16Array, normals?: Float32Array, uvs?: Float32Array) {
//         super();
//         this.vertices = vertices || null;
//         this.indices = indices || null;
//         this.normals = normals || null;
//         this.uvs = uvs || null;
//     }

//     compile(): void { 
//         const API = ServiceLocator.get<IRenderingApi>("RenderingApi");
//         this.vertexBuffer = API.createVertexBuffer(this.vertices);
//         this.indexBuffer = API.createIndexBuffer(this.indices);
//         this.normalBuffer = API.createNormalBuffer(this.normals);
//         this.uvBuffer = API.createUVBuffer(this.uvs);

//         this.viewBuffer = API.createViewBuffer(Matrix4x4.identity().getData());
//     }
// }   


export default class Mesh extends Entity {

    vertices: Vector3[] | null = null;
    normals: Vector3[] | null = null;
    uvs: Vector2[] | null = null;
    indices: number[] | null = null;
  
    constructor(vertices?: Vector3[], indices?: number[], normals?: Vector3[], uvs?: Vector2[]) {
        super();
        this.vertices = vertices || null;
        this.indices = indices || null;
        this.normals = normals || null;
        this.uvs = uvs || null;
    }
}   