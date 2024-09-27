import Mathf from "../../Base/Mathf/Mathf";
import { WebGL2Api } from "../../Engine/graphycs/Mesh";
import Material from "./Material";
import ServiceLocator from "../../Engine/graphycs/ServiceLocator";
import { Shader } from "../../Shader/Shader";

export class Material2D extends Material {

    public texture: Texture | null = null;
    public image: HTMLImageElement | null = null;
    
    constructor() {
        super("new Material2D");
        this.shader = ServiceLocator.get<Shader>("Shader2D");
        this.shader.compile();
    }

    async setTexture(imageUrl: string): Promise<void> {
        const gl = (ServiceLocator.get("RenderingApi") as WebGL2Api).context;
        if (this.texture) {
            gl.deleteTexture(this.texture.data);
        }
        const textureData = await this.createTexture(gl, imageUrl);
        if (textureData) {
            this.texture = textureData;
        }
    }
    
    private async createTexture(gl: WebGLRenderingContext, imageUrl: string): Promise<Texture | null> {
        const texture = gl.createTexture();
        if (!texture) {
            console.error("Não foi possível criar a textura.");
            return null;
        }
        
        gl.bindTexture(gl.TEXTURE_2D, texture);
        
        // Configurar os parâmetros de filtragem e envolvimento da textura
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // Para evitar a repetição na borda
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // Para evitar a repetição na borda
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // Filtragem mais adequada para texturas pixeladas
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // Filtragem mais adequada para texturas pixeladas
    
        // Textura temporária (1x1 azul)
        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const format = gl.RGBA;
        const type = gl.UNSIGNED_BYTE;
        const pixels = new Uint8Array([0, 0, 255, 255]); // Textura sólida inicial
        gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, pixels);
        
        // Carregar a imagem
        const image = new Image();
        image.crossOrigin = "anonymous"; 
        
        const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
            image.onload = () => {
                resolve(image);
            };
            image.onerror = () => reject(new Error(`Erro ao carregar a imagem: ${imageUrl}`));
        });
    
        image.src = imageUrl;
        
        try {
            const loadedImage = await imageLoadPromise;
            gl.bindTexture(gl.TEXTURE_2D, texture);
            gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, format, type, loadedImage);
    
            if (Mathf.isPowerOfTwo(loadedImage.width) && Mathf.isPowerOfTwo(loadedImage.height)) {
                // Se for uma textura POT, você pode gerar mipmaps
                gl.generateMipmap(gl.TEXTURE_2D);
            } else {
                // Caso contrário, usar CLAMP_TO_EDGE
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
                gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
            }
    
            // Retorna uma nova instância da classe `Texture`
            return new Texture(texture, loadedImage.width, loadedImage.height);
    
        } catch (error) {
            console.error(error);
            gl.deleteTexture(texture);
            return null;
        }
    }
}

export class Texture {
    public data: WebGLTexture;
    //public image: TexImageSource;
    public width: number;
    public height: number;

    constructor(data: WebGLTexture, width: number, height: number) {
        this.data = data;
        this.width = width;
        this.height = height;
    }
}




   // private async createTexture(gl: WebGLRenderingContext, imageUrl: string): Promise<WebGLTexture | null> {
    //     const texture = gl.createTexture();
    //     if (!texture) {
    //         console.error("Não foi possível criar a textura.");
    //         return null;
    //     }
        
    //     gl.bindTexture(gl.TEXTURE_2D, texture);
        
    //   // Configurar os parâmetros de filtragem e envolvimento da textura
    //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE); // Para evitar a repetição na borda
    //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE); // Para evitar a repetição na borda
    //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST); // Filtragem mais adequada para texturas pixeladas
    //     gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST); // Filtragem mais adequada para texturas pixeladas

      
    //     const level = 0;
    //     const internalFormat = gl.RGBA;
    //     const width = 1;
    //     const height = 1;
    //     const border = 0;
    //     const format = gl.RGBA;
    //     const type = gl.UNSIGNED_BYTE;
    //     const pixels = new Uint8Array([0, 0, 255, 255]); 
    //     gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, width, height, border, format, type, pixels);
        
    //     const image = new Image();
    //     image.crossOrigin = "anonymous"; 

    //     const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
    //         image.onload = () => {
    //             resolve(image);
    //         };
    //         image.onerror = () => reject(new Error(`Erro ao carregar a imagem: ${imageUrl}`));
    //     });

    //     image.src = imageUrl;
        
    //     try {
    //         const loadedImage = await imageLoadPromise;
    //         gl.bindTexture(gl.TEXTURE_2D, texture);
    //         gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, format, type, loadedImage);

    //         if (Mathf.isPowerOfTwo(loadedImage.width) && Mathf.isPowerOfTwo(loadedImage.height)) {
    //             // gl.generateMipmap(gl.TEXTURE_2D);
    //         } else {
    //             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    //             gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    //         }

    //         return texture;
    //     } catch (error) {
    //         console.error(error);
    //         gl.deleteTexture(texture);
    //         return null;
    //     }
    // }