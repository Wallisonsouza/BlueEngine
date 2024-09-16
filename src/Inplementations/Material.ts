import Vector2 from "../../engine_modules/vectors/Vector2";
import Color from "../Engine/static/color";
import { Shader } from "../Shader/Shader";

export class Material {
    
    public shader: Shader | null = null;
    public color: Color = Color.white; 
    // public texture: WebGLTexture | null = null;
    public tiling: Vector2 = Vector2.one;
    public offset: Vector2 = Vector2.zero;

    // setTexture(imageUrl: string): void {

    //     const gl = (EngineCache.getRenderingAPI() as WebGL2Api).context;
    //     const newTexture = this.createTexture(gl, imageUrl);
    //     if (newTexture) {
    //         if (this.texture) {
    //             gl.deleteTexture(this.texture); 
    //         }
    //         this.texture = newTexture;
    //     }
    // }

   

    public setTiling(value: Vector2){
        this.tiling = value;
    }

    public setOffset(value: Vector2){
        this.offset = value;
    }
}
