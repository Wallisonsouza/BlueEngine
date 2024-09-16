import Input from "../../Base/Input/Input";
import Camera from "../../Inplementations/Camera";
import Component from "../components/Component";
import { WebGL2Api } from "../graphycs/Mesh";
import Renderer from "../graphycs/Renderer";
import ServiceLocator from "../graphycs/ServiceLocator";
import EngineCache from "../static/EngineCache";
import SceneManager from "./SceneManager";

export default class RendererManager {

    public static update() {
        const API = EngineCache.getRenderingAPI();

        if (API instanceof WebGL2Api) {
            const currentScene = SceneManager.getCurrentScene();
            const sceneHierarchy = currentScene.getHierarchy();
            const gameEntities = sceneHierarchy.getGameObjects();

            const camera = Camera.main.camera;

            // Configurar a limpeza de tela e buffers
            const [r, g, b, a] = camera.clearColor.toArray();
            API.context.clearColor(r, g, b, a);
            API.context.clearDepth(1.0);
            API.context.clearStencil(0);
            API.context.clear(API.context.COLOR_BUFFER_BIT | API.context.DEPTH_BUFFER_BIT | API.context.STENCIL_BUFFER_BIT);

         
            API.context.viewport(0, 0, window.innerWidth, window.innerHeight);
            camera.aspectRatio = window.innerWidth / window.innerHeight;

            gameEntities.forEach(entity => {
                if (!entity.active) {
                    return;
                }

                entity.getComponents(Component).forEach(component => {

                    if(component instanceof Renderer) {
                        if (!component.active) {
                            return;
                        }

                        component.render(API.context, entity.transform, camera);
                    }
                    component.drawGizmos();
                    
                })
            });
        }
    }
}