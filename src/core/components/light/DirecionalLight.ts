import Light from "./Light";

export default class DirecionalLight extends Light {

    public static readonly TYPE = "DirecionalLight";

    constructor() {
        super(DirecionalLight.TYPE);
    }

    public static angle: number = 0.0;
}