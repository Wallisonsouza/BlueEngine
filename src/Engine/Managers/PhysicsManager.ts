import { WebGL2Api } from "../graphycs/Mesh";
import Input from "../../Base/Input/Input";
import SceneManager from "./SceneManager";
import Collider from "../../Engine2D/Components/Collider";
import ServiceLocator from "../graphycs/ServiceLocator";

import Color from "../static/color";
import Camera from "../../components/Camera";
import { IRenderingApi } from "../../global";

export default class PhysicsManager {

    public static fixedUpdate(){
        const API = ServiceLocator.get<IRenderingApi>("RenderingApi");

        if (API instanceof WebGL2Api) {

            const camera = ServiceLocator.get<Camera>("ActiveCamera");
            const currentScene = SceneManager.getCurrentScene();
            const sceneHierarchy = currentScene.getHierarchy();
            const gameEntities = sceneHierarchy.getGameObjects();

            gameEntities.forEach(entity => {
                if (!entity.active) {
                    return;
                }

                const coliders = entity.getComponents(Collider);
                coliders.forEach(collider => {

                    const ray = camera.screenPointToRay(Input.mousePosition);
                   
                    if(collider.raycast(ray, Infinity)) {
                       collider.color = Color.red;
                    } else {
                        collider.color = Color.green;
                    }
                })
            });
        }
    }
}