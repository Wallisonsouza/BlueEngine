import Camera from "../../components/Camera";
import Component from "../../components/Component";
import Renderer from "../../components/Renderer";
import { IRenderingApi } from "../../global";
import { WebGL2Api } from "../graphycs/Mesh";
import ServiceLocator from "../graphycs/ServiceLocator";
import SceneManager from "./SceneManager";

export default class RendererManager {
    public static update(): void {
        const API = ServiceLocator.get<IRenderingApi>('RenderingApi');
        const camera = ServiceLocator.get<Camera>('ActiveCamera');

        if (!(API instanceof WebGL2Api)) {
            console.error("API de renderização não é uma instância de WebGL2Api.");
            return;
        }

        if (!camera) {
            console.error("Camera principal não disponível.");
            return;
        }

        const [r, g, b, a] = camera.clearColor.toArray();
        API.context.clearColor(r, g, b, a);
        API.context.clear(API.context.COLOR_BUFFER_BIT | API.context.DEPTH_BUFFER_BIT);
        API.context.viewport(0, 0, window.innerWidth, window.innerHeight);
        camera.aspectRatio = window.innerWidth / window.innerHeight;

        const gameEntities = SceneManager.getCurrentScene().getHierarchy().getGameObjects();

        gameEntities.forEach(entity => {
            if (!entity.active) return;

            entity.getComponents(Component).forEach(component => {
                if (!component.active) return;

                if(component instanceof Renderer) {
                    component.render(API.context, entity.transform, camera);
                }
            });
        });
    }

    public static drawGizmos(): void {
        const API = ServiceLocator.get<IRenderingApi>('RenderingApi');
        const camera = ServiceLocator.get<Camera>('ActiveCamera');

        if (!(API instanceof WebGL2Api)) {
            console.error("API de renderização não é uma instância de WebGL2Api.");
            return;
        }

        if (!camera) {
            console.error("Camera principal não disponível.");
            return;
        }

        const gameEntities = SceneManager.getCurrentScene().getHierarchy().getGameObjects();

        gameEntities.forEach(entity => {
            entity.getComponents(Component).forEach(component => {
                if (component.active) {
                    component.drawGizmos();
                }
            });
        });
    }
}
