
import Camera from "../../Inplementations/Camera";
import { WebGL2Api } from "../graphycs/Mesh";
import Renderer from "../graphycs/Renderer";
import EngineCache from "../static/EngineCache";
import SceneManager from "./SceneManager";

export default class RendererManager {

    public static update(): void {
        const API = EngineCache.getRenderingAPI();

        if (API instanceof WebGL2Api) {
            const currentScene = SceneManager.getCurrentScene();
            const sceneHierarchy = currentScene.getHierarchy();
            const gameEntities = sceneHierarchy.getGameObjects();
            const camera = Camera.main.camera;

            if (!camera) {
                console.error("Camera principal não disponível.");
                return;
            }

            const [r, g, b, a] = camera.clearColor.toArray();
            API.context.clearColor(r, g, b, a);
            API.context.clear(API.context.COLOR_BUFFER_BIT | API.context.DEPTH_BUFFER_BIT);

            API.context.viewport(0, 0, window.innerWidth, window.innerHeight);
            camera.aspectRatio = window.innerWidth / window.innerHeight;

            gameEntities.forEach(entity => {
                if (!entity.active) {
                    return;
                }

                entity.getComponents(Renderer).forEach(component => {
                    if (!component.active) {
                        return;
                    }

                    if (component.render) {
                        component.render(API.context, entity.transform, camera);
                        component.drawGizmos();
                        
                    } else {
                        console.warn(`Componente ${component} não possui o método 'render'.`);
                    }
                
                   
                });
            });
        } else {
            console.error("API de renderização não é uma instância de WebGL2Api.");
        }
    }
}
