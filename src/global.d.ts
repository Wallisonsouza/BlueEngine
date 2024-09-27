/**
 * Interface para representar a API de renderização.
 * Define os métodos necessários para criar buffers e acessar a instância de renderização.
 */
export interface IRenderingApi {

     createBuffer(data: Float32Array | null, target: number, usage: number): WebGLBuffer | null;
    /**
     * Cria um buffer de vértices a partir de um array de vértices.
     * @param data - Dados dos vértices.
     * @returns O buffer de vértices criado ou `null` caso a criação falhe.
     */
    createVertexBuffer(data: Float32Array | null): WebGLBuffer | null;

    /**
     * Cria um buffer de índices a partir de um array de índices.
     * @param data - Dados dos índices.
     * @returns O buffer de índices criado ou `null` caso a criação falhe.
     */
    createIndexBuffer(data: Uint16Array | null): WebGLBuffer | null;

    /**
     * Cria um buffer de normais a partir de um array de normais.
     * @param data - Dados dos normais.
     * @returns O buffer de normais criado ou `null` caso a criação falhe.
     */
    createNormalBuffer(data: Float32Array | null): WebGLBuffer | null;

    /**
     * Cria um buffer de UVs a partir de um array de coordenadas de UV.
     * @param data - Dados de coordenadas UV.
     * @returns O buffer de UVs criado ou `null` caso a criação falhe.
     */
    createUVBuffer(data: Float32Array | null): WebGLBuffer | null;
    createColorBuffer(data: Float32Array | null): WebGLBuffer | null;
    createViewBuffer(data: Float32Array | null): WebGLBuffer | null;
    /**
     * Obtém a instância atual do contexto WebGL2 para renderização.
     * @returns A instância de `WebGL2RenderingContext`.
     */
    getRenderInstance(): WebGL2RenderingContext;

    createArrayBuffer(data: Float32Array[]): WebGLBuffer | null;
}
 
/**
 * Interface para definir os dados de uma malha.
 * Inclui informações de vértices, índices, normais e coordenadas UV.
 */
export interface IMeshData {
    /**
     * Array de vértices da malha.
     */
    vertices: Float32Array | null;

    /**
     * Array de índices da malha.
     */
    indices: Uint16Array | null;

    /**
     * Array de normais da malha.
     */
    normals: Float32Array | null;

    /**
     * Array de coordenadas UV da malha.
     */
    uvs: Float32Array | null;
}

/**
 * Interface para definir os buffers de uma malha.
 * Representa os buffers de vértices, índices, normais e UVs necessários para a renderização.
 */
export interface IMeshBuffers {
    /**
     * Buffer de vértices.
     */
    vertexBuffer: WebGLBuffer | null;

    /**
     * Buffer de índices.
     */
    indexBuffer: WebGLBuffer | null;

    /**
     * Buffer de normais.
     */
    normalBuffer: WebGLBuffer | null;

    /**
     * Buffer de UVs.
     */
    uvBuffer: WebGLBuffer | null;

    /**
     * Compila os dados da malha e cria os buffers necessários.
     */
    compile(): void;
}

type shaderData = "float" | "vector3Float" | "vector2Float" | "int" | "matrix4x4Float"