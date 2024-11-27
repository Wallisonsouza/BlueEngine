import Color from "../../math/color";
import Vector2 from "../../math/Vector2";
import { Shader } from "../shaders/Shader";

export default class Material {
    public name: string;
    public shader: Shader | null = null;
    public color: Color = Color.white; 
    public tiling: Vector2 = Vector2.one;
    public offset: Vector2 = Vector2.zero;
    public alpha: number = 1;
    constructor(name?: string) {
        this.name = name ?? "new Material";
    }
}