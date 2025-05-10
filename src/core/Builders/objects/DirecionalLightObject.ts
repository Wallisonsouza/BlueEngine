import GameObject from "../../components/GameObject";
import DirecionalLight from "../../components/light/DirecionalLight";
import Quaternion from "../../math/Quaternion";
import Vector3 from "../../math/Vector3";

export default class DirecionalLightObject {

    public static create(): GameObject {
        const lightGameObject = new GameObject();
        lightGameObject.transform.rotation =  Quaternion.fromEulerAnglesVector3(new Vector3(90, 0, 0)); 
        lightGameObject.transform.position = new Vector3(0, 5, 0);
        const lightComponent = new DirecionalLight();
        lightComponent.setGameObject(lightGameObject);
        lightGameObject.addComponentInstance(lightComponent);
        return lightGameObject;
    }
    
}