import Light from "./Light";

export default class LightManager {
    private static _lights: Light[] = [];

    public static addLight(light: Light) {
        if(!this._lights?.includes(light)) {
            this._lights.push(light);
        }
    }

    public static getLights() {
        return this._lights;
    }
}