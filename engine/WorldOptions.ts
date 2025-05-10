import DirecionalLightObject from "../src/core/Builders/objects/DirecionalLightObject";
import DirecionalLight from "../src/core/components/light/DirecionalLight";
import { RenderMode } from "../src/core/enum/RenderMode";
import { RenderPass } from "../src/core/enum/RenderPass";
import Color from "../src/core/math/color";

export default class WorldOptions {
    public static color: Color  = new Color(0.51, 0.51, 0.51);
    public static strength: number = 1.0;
    public static renderPass: RenderPass = RenderPass.SHADED;
    public static renderMode: RenderMode = RenderMode.TRIANGLES;
    public static environmentTexture: WebGLTexture | null = null;
    public static sunLight: DirecionalLight = DirecionalLightObject.create().getComponentByType<DirecionalLight>("DirecionalLight");
}