import { IRenderingApi } from "../../global";

export default class EngineCache {
    private static API: IRenderingApi;

    public static setRenderingAPI(API: IRenderingApi) {
        this.API = API;
    }

    public static getRenderingAPI(): IRenderingApi {
        return this.API;
    }
}