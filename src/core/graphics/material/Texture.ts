import Mathf from "../../math/Mathf";

export class EngineCache {
    public static textureCache: Map<string, WebGLTexture> = new Map();
}

export default class Texture {
  
    private _width: number = 1024;
    private _height: number = 1024;
    private _webGLTexture: WebGLTexture | null = null;
    private _image: HTMLImageElement | null = null; 

    constructor(private _imageUrl: string) {}

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public setGlTexture(texture: WebGLTexture) {
        this._webGLTexture = texture;
    }

    public get webGLTexture(): WebGLTexture | null {
        return this._webGLTexture;
    }

    public get image(): HTMLImageElement | null { 
        return this._image;
    }

    public async load(
        gl: WebGLRenderingContext, 
        minFilter: number = gl.LINEAR, 
        magFilter: number = gl.LINEAR, 
        wrapS: number = gl.REPEAT, 
        wrapT: number = gl.REPEAT
    ): Promise<WebGLTexture | null> {
        if (!this._imageUrl) {
            console.error("Imagem URL não fornecida");
            return null;
        }
    
        const placeholderTexture = gl.createTexture();
        if (!placeholderTexture) {
            console.error("Não foi possível criar a textura de placeholder no WebGL.");
            return null;
        }
    
        gl.bindTexture(gl.TEXTURE_2D, placeholderTexture);
    
        const magentaPixel = new Uint8Array([255, 0, 255, 255]);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, magentaPixel);
    
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, minFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, magFilter);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, wrapS);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, wrapT);
    
        this._webGLTexture = placeholderTexture;
    
        const image = new Image();
        image.crossOrigin = "anonymous";
    
        const imageLoadPromise = new Promise<HTMLImageElement>((resolve, reject) => {
            image.onload = () => resolve(image);
            image.onerror = () => reject(new Error(`Erro ao carregar a imagem: ${this._imageUrl}`));
        });
    
        image.src = this._imageUrl;
    
        try {
            await imageLoadPromise;
    
            this._width = image.width;
            this._height = image.height;
            this._image = image; 
          

            gl.bindTexture(gl.TEXTURE_2D, placeholderTexture);
            gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    
            if (Mathf.isPowerOfTwo(this._width) && Mathf.isPowerOfTwo(this._height)) {
                gl.generateMipmap(gl.TEXTURE_2D);
            }
    
            return placeholderTexture;
        } catch (error) {
            console.error("Erro ao carregar a textura:", error);
            return placeholderTexture;
        }
    }
}
