import Camera from "../components/Camera";
import Display from "../components/Display";
import { BufferTarget, BufferUsage } from "../enum/Buffer";
import Mesh from "../graphics/mesh/Mesh";
import Mathf from "../math/Mathf";
import Vector2 from "../math/Vector2";
import Vector3 from "../math/Vector3";

export type Data = Float32Array | Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array;

export interface BufferData {
    index: number;
    data: Data;
    usage: BufferUsage;
    target: BufferTarget;
    size: number;
}

export interface ObjectBuffer {
    id: number;
    buffersData: (BufferData | null)[];
}


export interface UniformBufferConfig {
    usage: BufferUsage;
    target: BufferTarget;
    size: number;
}


export interface UniformBufferData {
    offset: number;
    data: Data;
}


export interface UniformBufferObject {
    target: BufferTarget;
    id: number;
    uniformsData: (UniformBufferData|null)[];
}



export default class BufferManager {

    private static createWebGLBuffer(context: WebGL2RenderingContext, target: BufferTarget, data: Data, usage: BufferUsage): WebGLBuffer {
        const buffer = context.createBuffer();
        if (!buffer) {
            throw new Error('Failed to create buffer');
        }
        context.bindBuffer(target, buffer);
        context.bufferData(target, data, usage); 
        context.bindBuffer(target, null);
        return buffer;
    }

    public static createUniformBuffer(id: number, uniformBlock: UniformBufferConfig): WebGLBuffer {

        if (this.uniformsBuffer.has(id)) {
            throw new Error(`Já existe um buffer de uniformes com este id "${id}".`);
        }

        const context = Display.webGl;
        const buffer = context.createBuffer();
        if (!buffer) {
            throw new Error('Failed to create buffer');
        }
        context.bindBuffer(uniformBlock.target, buffer);
        context.bufferData(uniformBlock.target, uniformBlock.size, uniformBlock.usage); 
        context.bindBuffer(uniformBlock.target, null);
        
        this.uniformsBuffer.set(id, buffer);
        return buffer;
    }


    public static createObjectBuffer(objectBuffer: ObjectBuffer): WebGLVertexArrayObject | null {
        const gl2 = Display.webGl;

    
        const buffers: Map<BufferData, WebGLBuffer> = new Map();

        for (const bufferData of objectBuffer.buffersData) {
            if (bufferData) {
                const buffer = this.createWebGLBuffer(
                    gl2, 
                    bufferData.target, 
                    bufferData.data, 
                    bufferData.usage
                );
        
                buffers.set(bufferData, buffer);
            }
        }
        
        const vao = gl2.createVertexArray();
        if (!vao) {
            throw new Error("Falha ao criar Vertex Array Object (VAO).");
        }
    
        gl2.bindVertexArray(vao);

        
        for (const [bufferData, buffer] of buffers) {

            if(bufferData.target === BufferTarget.ARRAY_BUFFER) {

                gl2.bindBuffer(bufferData.target, buffer);
                gl2.enableVertexAttribArray(bufferData.index);
                gl2.vertexAttribPointer(bufferData.index, bufferData.size, gl2.FLOAT, false, 0, 0);
                
            } else if(bufferData.target === BufferTarget.ELEMENT_ARRAY_BUFFER) {
                gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, buffer);
            }
        }


        gl2.bindVertexArray(null);
        this.bufferCache.set(objectBuffer.id, vao);

        return vao;
    }

    public static createMeshBuffer(mesh: Mesh) {
  
        let vertexBuffer: BufferData | null = null;
        let indexBuffer: BufferData | null = null;
        let normalBuffer: BufferData | null = null;
        let uvBuffer: BufferData | null = null;
        let tangentBuffer: BufferData | null = null;
        let wireframeBuffer: BufferData | null = null;
   
        if (mesh.vertices) {
            vertexBuffer = {
                index: 0,
                data: Vector3.arrayToF32Array(mesh.vertices),
                usage: BufferUsage.STATIC_DRAW,
                target: BufferTarget.ARRAY_BUFFER,
                size: Vector3.SIZE
            };
        }
    
        if (mesh.triangles) {
            indexBuffer = {
                index: 0,
                data: Mathf.chooseTypedArray(mesh.triangles), 
                usage: BufferUsage.STATIC_DRAW,
                target: BufferTarget.ELEMENT_ARRAY_BUFFER,
                size: 1 
            };
        }

        if(mesh.wireframeTriangles) {
            wireframeBuffer = {
                index: 1,
                data: Mathf.chooseTypedArray(mesh.wireframeTriangles), 
                usage: BufferUsage.STATIC_DRAW,
                target: BufferTarget.ELEMENT_ARRAY_BUFFER,
                size: 1 
            };
        }
    
        if (mesh.normals) {
            normalBuffer = {
                index: 1,
                data: Vector3.arrayToF32Array(mesh.normals),
                usage: BufferUsage.STATIC_DRAW,
                target: BufferTarget.ARRAY_BUFFER,
                size: Vector3.SIZE
            };
        }
    
        if (mesh.uvs) {
            uvBuffer = {
                index: 2,
                data: Vector2.arrayToF32Array(mesh.uvs),
                usage: BufferUsage.STATIC_DRAW,
                target: BufferTarget.ARRAY_BUFFER,
                size: Vector2.SIZE
            };
        }

        if(mesh.tangents) {
            tangentBuffer = {
                index: 3,
                data: Vector3.arrayToF32Array(mesh.tangents),
                usage: BufferUsage.STATIC_DRAW,
                target: BufferTarget.ARRAY_BUFFER,
                size: Vector3.SIZE
            };
        }
    
        BufferManager.createObjectBuffer({
            id: mesh.id.value, 
            buffersData: [vertexBuffer, normalBuffer, uvBuffer, tangentBuffer, indexBuffer]
        });
        
        BufferManager.createObjectBuffer({
            id: mesh.id.value + 10000, 
            buffersData: [vertexBuffer, normalBuffer, uvBuffer, tangentBuffer, wireframeBuffer]
        });
    }

    public static createCameraBuffer(camera: Camera) {
        const blockConfig: UniformBufferConfig = {
            size: 128, 
            usage: BufferUsage.DYNAMIC_DRAW,
            target: BufferTarget.UNIFORM_BUFFER
        };
    
        this.createUniformBuffer(camera.id.value, blockConfig);
        BufferManager.updateCameraBuffer(camera);
    }
    
    private static bufferCache: Map<number, WebGLVertexArrayObject | null> = new Map();
    private static uniformsBuffer: Map<number, WebGLBuffer> = new Map();
     
    public static getVBO(id: number) {
        return this.bufferCache.get(id) ?? null;
    }

    public static getUniformBuffer(id: number) {
        return this.uniformsBuffer.get(id) ?? null;
    }

    public static updateUniformBuffer(uniformObjectBuffer: UniformBufferObject) {

        const gl = Display.webGl;

        const ubo = this.uniformsBuffer.get(uniformObjectBuffer.id)!;
        gl.bindBuffer(uniformObjectBuffer.target, ubo);

        for(const uniformData of uniformObjectBuffer.uniformsData) {
            
            if(uniformData) {
                gl.bufferSubData(uniformObjectBuffer.target, uniformData.offset, uniformData.data);
            }
        }

        gl.bindBuffer(uniformObjectBuffer.target, null);
    }
    public static updateCameraBuffer(camera: Camera) {
        let viewBuffer: UniformBufferData | null = null;
        let projectioBuffer: UniformBufferData | null = null;
        
        if(camera.viewMatrix) {
            viewBuffer =  {
                data: camera.viewMatrix.getData(),
                offset: 0
            }
    
        }

        if(camera.projectionMatrix) {
            projectioBuffer =  {
                data: camera.projectionMatrix.getData(),
                offset: 64
            } 
        }

        const ubo: UniformBufferObject = {
            id: camera.id.value,
            target: BufferTarget.UNIFORM_BUFFER,
            uniformsData: [
                viewBuffer,
                projectioBuffer
            ]
        }

        this.updateUniformBuffer(ubo);
    }


}
