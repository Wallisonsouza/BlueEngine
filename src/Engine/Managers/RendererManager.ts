import Camera from "../../components/Camera";
import { WebGL2Api } from "../graphycs/Mesh";
import SceneManager from "./SceneManager";
import ServiceLocator from "../graphycs/ServiceLocator";
import { IRenderingApi } from "../../global";
import Component from "../../components/Component";
import MeshRenderer from "../graphycs/MeshRenderer";
import PointLight from "../../Engine2D/Components/Light";

export default class RendererManager {

    public static update(): void {
        const API = ServiceLocator.get<IRenderingApi>('RenderingApi');
        const camera = ServiceLocator.get<Camera>('ActiveCamera');

        if (API instanceof WebGL2Api) {
            const currentScene = SceneManager.getCurrentScene();
            const sceneHierarchy = currentScene.getHierarchy();
            const gameEntities = sceneHierarchy.getGameObjects();

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
                if (!entity.active) return;

                entity.getComponents(Component).forEach(component => {
                    if (!component.active) return;

                    if(component.identifier === "MeshRenderer") {
                        const comp = component as MeshRenderer;
                        comp.render(API.context, entity.transform, camera);
                    }

                    component.drawGizmos();
                   
                });
            });

        } else {
            console.error("API de renderização não é uma instância de WebGL2Api.");
        }
    }
}
