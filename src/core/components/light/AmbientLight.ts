import Color from "../../math/color";
import Light from "./Light";
export default class AmbientLight extends Light {

    public static readonly STRING_NAME = "AmbientLight";

    constructor(color?: Color, intensity?: number) {
        super(AmbientLight.STRING_NAME, color, intensity);
    }
}
