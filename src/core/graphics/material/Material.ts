import Entity from "../../components/Entity";
import { AlphaMode } from "../../enum/AlphaMode";
import ShaderManager from "../../managers/ShaderManager";
import UniformBlock from "../../managers/UniformBlock";
import Color from "../../math/color";
import Vector2 from "../../math/Vector2";
import MaterialManager from "../mesh/MaterialManager";
import Shader from "../shaders/Shader";

export default class Material extends Entity {


    public shader: Shader;
    public uniformBlock: UniformBlock = new UniformBlock();
    public name: string;
   
    public tiling = Vector2.ONE;
    public offset = Vector2.ZERO;
 
    public alphaMode = AlphaMode.OPAQUE;
   
    private _color = Color.WHITE;
    private _alpha = 1.0;

    public get color() {
        return this._color;
    }
    public get alpha() {
        return this._alpha;
    }
    public set alpha(value: number) {
        if(this._alpha !== value) {
            this._alpha = value;
            this.uniformBlock.setFloat("alpha", value);
        }
    }
    public set color(value: Color) {
        if (!this._color.equals(value)) {
            this._color = value;
           this.uniformBlock.setVec3("color", value.toF32Array());
        }
    }
    

    constructor(name = "", shader?: Shader) {
        super();
        this.name = name;
        this.shader = shader ?? ShaderManager.getShader("3d");


        this.uniformBlock.defineVec3("color", new Float32Array(this._color.rgb));
        this.uniformBlock.defineFloat("alpha", 1.0);
       
    }

    public get isTransparent(): boolean {
        return this.alphaMode !== AlphaMode.OPAQUE || this._alpha < 1.0;
    }

    apply() {
        
      
    }
    update() {
        
    }
}
