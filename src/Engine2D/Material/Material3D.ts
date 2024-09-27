import Mathf from "../../Base/Mathf/Mathf";
import { WebGL2Api } from "../../Engine/graphycs/Mesh";
import ServiceLocator from "../../Engine/graphycs/ServiceLocator";
import { Shader } from "../../Shader/Shader";
import Material from "./Material";

export default class Material3D  extends Material {

    public metalic: number = 0.8;
    public roughness: number = 0.5;
    public albedo: WebGLTexture | null = null;
    public normalMap: WebGLTexture | null = null;
    public metalicTexture: WebGLTexture | null = null;
    
    constructor() {
        super("new Material3D");
        this.shader = ServiceLocator.get<Shader>("Shader3D");

        const metalicInput = document.getElementById("metalic") as HTMLInputElement;
        metalicInput.oninput = (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (!target) {
                return;
            }
            this.metalic = Number(target.value);
        };

        const roughnessInput = document.getElementById("roughness") as HTMLInputElement;
        roughnessInput.oninput = (event: Event) => {
            const target = event.target as HTMLInputElement;
            if (!target) {
                return;
            }
            this.roughness = Number(target.value);
        };
    }

    async setAlbedo(imageUrl: string): Promise<void> {
        const gl = (ServiceLocator.get("RenderingApi") as WebGL2Api).context;
        if (this.albedo) {
            gl.deleteTexture(this.albedo);
        }

        this.albedo = await this.createTexture(gl, imageUrl);
    }

    async setNormalMap(imageUrl: string) {
        const gl = (ServiceLocator.get("RenderingApi") as WebGL2Api).context;
        if (this.normalMap) {
            gl.deleteTexture(this.normalMap);
        }

        this.normalMap = await this.createTexture(gl, imageUrl);
    }

    async setMetalicTexture(imageUrl: string) {
        const gl = (ServiceLocator.get("RenderingApi") as WebGL2Api).context;
        if (this.metalicTexture) {
            gl.deleteTexture(this.metalicTexture);
        }

        this.metalicTexture = await this.createTexture(gl, imageUrl);
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