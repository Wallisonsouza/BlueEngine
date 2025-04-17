import { RenderMode } from "../src/core/enum/RenderMode";
import Color from "../src/core/math/color";

export default class WorldOptions {
    public static color: Color  = new Color(0.51, 0.51, 0.51);
    public static strength: number = 1.0;
    public static renderPass: number = 0;
    public static renderMode: RenderMode = RenderMode.LINES;
    public static environmentTexture: WebGLTexture | null = null;
}