import Color from "../../math/color";
import Light from "./Light";
export default class AmbientLight extends Light {

    public static readonly TYPE = "AmbientLight";
    constructor(color?: Color, intensity?: number) {
        super(AmbientLight.TYPE, color, intensity);
    }
}
