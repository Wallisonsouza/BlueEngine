import Mathf from "../../math/Mathf";
import ServiceLocator from "../../factory/ServiceLocator";
import { Shader } from "../shaders/Shader";
import Material from "./Material";
import { WebGL2Api } from "../mesh/WebGl2Api";

export default class Material3D  extends Material {

    public metalic: number = 0.0;
    public roughness: number = 0.0;
    public baseColorTexture: WebGLTexture | null = null;
    public normalTexture: WebGLTexture | null = null;
    public metallicTexture: WebGLTexture | null = null;
    public environmentTexture: WebGLTexture | null = null;
    public metallicRoughnessTexture: WebGLTexture | null = null;
    public ior: number = 1.5;
    
    constructor() {
        super("new Material3D");
        this.shader = Shader.getShader("3D");
    }

    async setMetallicRoughnessTexture(imageUrl: string) {
        const gl = (ServiceLocator.get("RenderingApi") as WebGL2Api).context;
        if (this.metallicRoughnessTexture) {
            gl.deleteTexture(this.metallicRoughnessTexture);
        }

        this.metallicRoughnessTexture = await this.createTexture(gl, imageUrl);
    }

    async setBaseColorTexture(imageUrl: string): Promise<void> {
        const gl = (ServiceLocator.get("RenderingApi") as WebGL2Api).context;
        if (this.baseColorTexture) {
            gl.deleteTexture(this.baseColorTexture);
        }

        this.baseColorTexture = await this.createTexture(gl, imageUrl);
    }

    async setNormalTexture(imageUrl: string) {
        const gl = (ServiceLocator.get("RenderingApi") as WebGL2Api).context;
        if (this.normalTexture) {
            gl.deleteTexture(this.normalTexture);
        }

        this.normalTexture = await this.createTexture(gl, imageUrl);
    }

    async setMetalicTexture(imageUrl: string) {
        const gl = (ServiceLocator.get("RenderingApi") as WebGL2Api).context;
        if (this.metallicTexture) {
            gl.deleteTexture(this.metallicTexture);
        }

        this.metallicTexture = await this.createTexture(gl, imageUrl);
    }

    async setReflectionMap(imageUrl: string) {
        const gl = (ServiceLocator.get("RenderingApi") as WebGL2Api).context;
        if (this.environmentTexture) {
            gl.deleteTexture(this.environmentTexture);
        }

        this.environmentTexture = await this.createTexture(gl, imageUrl);
    }

    private async createTexture(gl: WebGLRenderingContext, imageUrl: string): Promise<WebGLTexture | null> {
        const texture = gl.createTexture();
        if (!texture) {
            console.error("Não foi possível criar a textura.");
            return null;
        }
        
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        const wrapMode = gl.CLAMP_TO_EDGE; 

        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapMode); // Defina o modo de repetição para o eixo S
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapMode); // 
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
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapMode);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapMode);
            }

            return texture;
        } catch (error) {
            console.error(error);
            gl.deleteTexture(texture);
            return null;
        }
    }
}