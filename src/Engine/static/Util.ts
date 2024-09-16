import { WebGlBufferCreationError } from "./Error";

export class MeshUtil {
    public static createVertexBufferWebGl(gl: WebGLRenderingContext, vertices: Float32Array | null) {
        if (!vertices || vertices.length === 0) {
            throw new WebGlBufferCreationError("vértices", "O array de vértices está vazio ou não definido.");
        }
        
        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new WebGlBufferCreationError("vértices", "Falha ao alocar memória para o buffer.");
        }
    
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
        return buffer;
    }
    
    public static createIndexBufferWebGl(gl: WebGLRenderingContext, indices: Uint16Array | null) {
        if (!indices || indices.length === 0) {
            throw new WebGlBufferCreationError("índices", "O array de índices está vazio ou não definido.");
        }
    
        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new WebGlBufferCreationError("índices", "Falha ao alocar memória para o buffer.");
        }
    
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
        return buffer;
    }
    
    public static createNormalBufferWebGl(gl: WebGLRenderingContext, normals: Float32Array | null) {
        if (!normals || normals.length === 0) {
            throw new WebGlBufferCreationError("normais", "O array de normais está vazio ou não definido.");
        }
    
        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new WebGlBufferCreationError("normais", "Falha ao alocar memória para o buffer.");
        }
    
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, normals, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
        return buffer;
    }
    
    public static createUVBufferWebGl(gl: WebGLRenderingContext, uvs: Float32Array | null) {
        if (!uvs || uvs.length === 0) {
            throw new WebGlBufferCreationError("UVs", "O array de UVs está vazio ou não definido.");
        }
    
        const buffer = gl.createBuffer();
        if (!buffer) {
            throw new WebGlBufferCreationError("UVs", "Falha ao alocar memória para o buffer.");
        }
    
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, uvs, gl.STATIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
    
        return buffer;
    }
    
    // public calculateNormals(): void {
    //     const vertices = this.vertices;
    //     const indices = this.vertexIndices;

    //     this.normals = new Float32Array(vertices.length);
    //     this.normals.fill(0);

    //     for (let i = 0; i < indices.length; i += 3) {
    //     const i1 = indices[i] * 3;
    //     const i2 = indices[i + 1] * 3;
    //     const i3 = indices[i + 2] * 3;

    //     const v1 = new Vec3(vertices[i1], vertices[i1 + 1], vertices[i1 + 2]);
    //     const v2 = new Vec3(vertices[i2], vertices[i2 + 1], vertices[i2 + 2]);
    //     const v3 = new Vec3(vertices[i3], vertices[i3 + 1], vertices[i3 + 2]);

    //     const edge1 = Vec3.subtract(v2, v1);
    //     const edge2 = Vec3.subtract(v3, v1);

    //     const normal = Vec3.normalize(Vec3.cross(edge1, edge2));
    //     this.normals[i1] += normal.x;
    //     this.normals[i1 + 1] += normal.y;
    //     this.normals[i1 + 2] += normal.z;

    //     this.normals[i2] += normal.x;
    //     this.normals[i2 + 1] += normal.y;
    //     this.normals[i2 + 2] += normal.z;

    //     this.normals[i3] += normal.x;
    //     this.normals[i3 + 1] += normal.y;
    //     this.normals[i3 + 2] += normal.z;
    //     }

    //     // Normalização das normais
    //     for (let i = 0; i < this.normals.length; i += 3) {
    //     const normal = new Vec3(this.normals[i], this.normals[i + 1], this.normals[i + 2]);
    //     const normalizedNormal = Vec3.normalize(normal);
    //     this.normals[i] = normalizedNormal.x;
    //     this.normals[i + 1] = normalizedNormal.y;
    //     this.normals[i + 2] = normalizedNormal.z;
    //     }
    // }
}

export class MaterialUtil {

    public static setTexture(gl: WebGL2RenderingContext, target: WebGLTexture | null, src: string) {
        const newTexture = this.createWebGlTexture(gl, src);
        if (newTexture) {
            if (target) {
                gl.deleteTexture(target); 
            }
            target = newTexture;
        }
    }

    // setNormalMap(imageUrl: string){
    //     const gl = EngineCache.gl;
    //     const newTexture = this.createTexture(gl, imageUrl);
    //     if (newTexture) {
    //         if (this.normalMap) {
    //             gl.deleteTexture(this.normalMap); 
    //         }
    //         this.normalMap = newTexture;
    //     }
    // }

    //  /**
    //  * Desvincula a textura atual do contexto WebGL.
    //  * @param gl - O contexto WebGL.
    //  */
    //  public unbindTextures(gl: WebGLRenderingContext): void {
    //     if (this.albedo !== null) {
    //         gl.bindTexture(gl.TEXTURE_2D, null); 
    //     }
        
    //     if(this.normalMap !== null){
    //         gl.bindTexture(gl.TEXTURE_2D, null); 
    //     }
    // }

    // /**
    //  * Vincula a textura ao contexto WebGL.
    //  * @param gl - O contexto WebGL.
    //  */
    // public bindTexture(gl: WebGLRenderingContext): void {
    //     if (this.albedo) {
    //         gl.activeTexture(gl.TEXTURE0);
    //         gl.bindTexture(gl.TEXTURE_2D, this.albedo); 
    //     } else {
    //         console.warn("Nenhuma textura para vincular.");
    //     }

    //     if(this.normalMap){
    //         gl.activeTexture(gl.TEXTURE1);
    //         gl.bindTexture(gl.TEXTURE_2D, this.normalMap); 
    //     }
    // }

    // setTiling(tiling: Vec2): void {
    //     this.tiling = tiling;
    // }

    // setOffset(offset: Vec2): void {
    //     this.offset = offset;
    // }

    public static createWebGlTexture(gl: WebGLRenderingContext, imageUrl: string): WebGLTexture | null {
        const texture = gl.createTexture();
        if (!texture) {
            console.error("Não foi possível criar a textura.");
            return null;
        }
        
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        // Define parâmetros padrão para a textura
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
       
        
        // Carrega uma textura temporária
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 256;
        const height = 256;
        const border = 0;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        const pixels = new Uint8Array([0, 0, 255, 255]); // Textura sólida inicial
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, pixels);
        
        const image = new Image();
        image.onload = () => {
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, format, type, image);
            gl.generateMipmap(gl.TEXTURE_2D);
            gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        };
        
        image.onerror = () => {
            console.error(`Erro ao carregar a imagem: ${imageUrl}`);
        };
        
        image.src = imageUrl;
    
        // Retorna a textura imediatamente, mesmo que a imagem não esteja carregada ainda
        return texture;
    }
}