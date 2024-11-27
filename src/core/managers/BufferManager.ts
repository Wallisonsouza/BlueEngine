import ServiceLocator from "../factory/ServiceLocator";
import { IRenderingApi } from "../../global";
import Mesh from "../graphics/mesh/Mesh";
import { WebGL2Api } from "../graphics/mesh/WebGl2Api";


// Interface para os buffers da malha
interface MeshBuffers {
    vertexBuffer: WebGLBuffer;
    indexBuffer: WebGLBuffer;
    normalBuffer?: WebGLBuffer;
    uvBuffer?: WebGLBuffer;
    tangentBuffer?: WebGLBuffer;
    bitangentBuffer?: WebGLBuffer;
}

export class BufferManager {
    private static buffers: Map<number, MeshBuffers> = new Map();

    // Método para registrar a malha
    public static registerMesh(mesh: Mesh) {

        const API = ServiceLocator.get<IRenderingApi>('RenderingApi');
            
    
        if (!(API instanceof WebGL2Api)) {
            console.error("API de renderização não é uma instância de WebGL2Api.");
            return;
        }

        const gl = API.context;
    
        if (!mesh.triangles) {
            throw new MeshReadException("A malha precisa ter ao menos 3 vértices.");
        }
        if (!mesh.vertices || mesh.vertices.length < 3) {
            throw new MeshReadException("A malha precisa ter ao menos 3 vértices.");
        }

        if (this.buffers.has(mesh.id)) {
            return this.buffers.get(mesh.id)!;
        }

        const vertexBuffer = this.createBuffer(gl, gl.ARRAY_BUFFER, mesh.vertices, "Falha ao criar buffer de vértices WebGL.");
        const indexBuffer = this.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, mesh.triangles, "Falha ao criar buffer de índices WebGL.");
        
        // Buffers opcionais
        const normalBuffer = mesh.normals ? this.createBuffer(gl, gl.ARRAY_BUFFER, mesh.normals, "Falha ao criar buffer de normais WebGL.") : undefined;
        const uvBuffer = mesh.uvs ? this.createBuffer(gl, gl.ARRAY_BUFFER, mesh.uvs, "Falha ao criar buffer de UVs WebGL.") : undefined;
        const tangentBuffer = mesh.tangents ? this.createBuffer(gl, gl.ARRAY_BUFFER, mesh.tangents, "Falha ao criar buffer de tangentes WebGL.") : undefined;
        const bitangentBuffer = mesh.bitangents ? this.createBuffer(gl, gl.ARRAY_BUFFER, mesh.bitangents, "Falha ao criar buffer de bitangentes WebGL.") : undefined;

        const meshBuffers: MeshBuffers = {
            vertexBuffer,
            indexBuffer,
            normalBuffer,
            uvBuffer,
            tangentBuffer,
            bitangentBuffer
        };

        this.buffers.set(mesh.id, meshBuffers);
        return meshBuffers;
    }

    // Método auxiliar para criar buffers
    private static createBuffer(gl: WebGLRenderingContext, target: number, data: Uint16Array | Uint32Array | Float32Array, errorMessage: string): WebGLBuffer {
        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new Error(errorMessage);
        }
        gl.bindBuffer(target, buffer);
        gl.bufferData(target, data, gl.STATIC_DRAW);
        return buffer;
    }

    // Método para obter buffer da malha
    public static getBuffer(id: number): MeshBuffers | null {
        return this.buffers.has(id) ? this.buffers.get(id)! : null;
    }

    // Método para sobrescrever (atualizar) a malha existente
    public static updateMesh(gl: WebGLRenderingContext, mesh: Mesh): void {
        if (!mesh.triangles) {
            throw new MeshReadException("A malha precisa ter ao menos 3 vértices.");
        }
        if (!mesh.vertices || mesh.vertices.length < 3) {
            throw new MeshReadException("A malha precisa ter ao menos 3 vértices.");
        }

        const existingBuffers = this.buffers.get(mesh.id);
        if (existingBuffers) {
            // Destruir os buffers antigos se existirem
            gl.deleteBuffer(existingBuffers.vertexBuffer);
            gl.deleteBuffer(existingBuffers.indexBuffer);
            if (existingBuffers.normalBuffer) gl.deleteBuffer(existingBuffers.normalBuffer);
            if (existingBuffers.uvBuffer) gl.deleteBuffer(existingBuffers.uvBuffer);
            if (existingBuffers.tangentBuffer) gl.deleteBuffer(existingBuffers.tangentBuffer);
            if (existingBuffers.bitangentBuffer) gl.deleteBuffer(existingBuffers.bitangentBuffer);
        }

        // Criar novos buffers para a malha atualizada
        const vertexBuffer = this.createBuffer(gl, gl.ARRAY_BUFFER, mesh.vertices, "Falha ao criar buffer de vértices WebGL.");
        const indexBuffer = this.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, mesh.triangles, "Falha ao criar buffer de índices WebGL.");

        // Buffers opcionais
        const normalBuffer = mesh.normals ? this.createBuffer(gl, gl.ARRAY_BUFFER, mesh.normals, "Falha ao criar buffer de normais WebGL.") : undefined;
        const uvBuffer = mesh.uvs ? this.createBuffer(gl, gl.ARRAY_BUFFER, mesh.uvs, "Falha ao criar buffer de UVs WebGL.") : undefined;
        const tangentBuffer = mesh.tangents ? this.createBuffer(gl, gl.ARRAY_BUFFER, mesh.tangents, "Falha ao criar buffer de tangentes WebGL.") : undefined;
        const bitangentBuffer = mesh.bitangents ? this.createBuffer(gl, gl.ARRAY_BUFFER, mesh.bitangents, "Falha ao criar buffer de bitangentes WebGL.") : undefined;

        // Atualizando os buffers da malha
        const meshBuffers: MeshBuffers = {
            vertexBuffer,
            indexBuffer,
            normalBuffer,
            uvBuffer,
            tangentBuffer,
            bitangentBuffer
        };

        // Registrar novamente os buffers
        this.buffers.set(mesh.id, meshBuffers);
    }
}

// Classe de exceção para leitura de malha
class MeshReadException extends Error {
    constructor(message: string) {
        super(message);
        this.name = "MeshReadException";
    }
}
