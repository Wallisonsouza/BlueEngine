import Vector2 from "../../../engine_modules/vectors/Vector2";
import Color from "../../Engine/static/color";
import { Shader } from "../../Shader/Shader";

export default class Material {
    name: string = "";
    public shader: Shader | null = null;
    public color: Color = Color.white; 
    public tiling: Vector2 = Vector2.one;
    public offset: Vector2 = Vector2.zero;

    public setTiling(value: Vector2){
        this.tiling = value;
    }
    public setOffset(value: Vector2){
        this.offset = value;
    }
}