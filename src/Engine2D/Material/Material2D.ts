import Mathf from "../../Base/Mathf/Mathf";
import { WebGL2Api } from "../../Engine/graphycs/Mesh";
import EngineCache from "../../Engine/static/EngineCache";
import { Material } from "../../Inplementations/Material";
import { DefaultValues } from "../../main";

export class Material2D extends Material {
    public texture: WebGLTexture | null = null;
    public image: HTMLImageElement | null = null;
    
    constructor() {
        super();
        this.shader = DefaultValues.shader2D;
    }

    async setTexture(imageUrl: string): Promise<void> {
        const gl = (EngineCache.getRenderingAPI() as WebGL2Api).context;
        if (this.texture) {
            gl.deleteTexture(this.texture);
        }

        this.texture = await this.createTexture(gl, imageUrl);
    }

    private async createTexture(gl: WebGLRenderingContext, imageUrl: string): Promise<WebGLTexture | null> {
        const texture = gl.createTexture();
        if (!texture) {
            console.error("Não foi possível criar a textura.");
            return null;
        }
        
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        // Configurar os parâmetros de filtragem e envolvimento da textura
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR); // Filtragem trilinear
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR); // Filtragem bilinear
        
        // Carregar uma textura temporária
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        const pixels = new Uint8Array([0, 0, 255, 255]); // Textura sólida inicial
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, pixels);
        
        const image = new Image();
        image.crossOrigin = "anonymous"; // Para evitar problemas de CORS
        const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error(`Erro ao carregar a imagem: ${imageUrl}`));
        });

        image.src = imageUrl;
        
        try {
            const loadedImage = await imageLoadPromise;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, format, type, loadedImage);

            if (Mathf.isPowerOfTwo(loadedImage.width) && Mathf.isPowerOfTwo(loadedImage.height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }

            return texture;
        } catch (error) {
            console.error(error);
            gl.deleteTexture(texture);
            return null;
        }
    }

  
}
