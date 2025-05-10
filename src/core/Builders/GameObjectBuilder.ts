import AmbientLight from "../components/light/AmbientLight";
import GameObject from "../components/GameObject";
import Color from "../math/color";

/// otimizar depois
export default class GameObjectBuilder {
   
   
 
 
    public static createAmbientLight(color?: Color): GameObject {
        const lightGameObject = new GameObject();
        const lightComponent = new AmbientLight(color);
        lightComponent.setGameObject(lightGameObject);
        lightGameObject.addComponentInstance(lightComponent);
        return lightGameObject;
    }
}
