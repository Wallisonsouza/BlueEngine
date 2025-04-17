import AmbientLight from "../components/light/AmbientLight";
import DirecionalLight from "../components/light/DirecionalLight";
import GameObject from "../components/GameObject";
import MeshFilter from "../components/MeshFilter";
import PBRMaterial from "../graphics/material/pbr/PBR_Material";
import MeshRenderer from "../graphics/mesh/MeshRenderer";
import MeshManager from "../managers/MeshManager";
import Color from "../math/color";
import Quaternion from "../math/Quaternion";
import Vector3 from "../math/Vector3";

/// otimizar depois
export default class GameObjectBuilder {
   
    public static createPlane(name: string = "New Plane"): GameObject {
        const planeGameObject = new GameObject(name);
        const planeMesh = MeshManager.getByName("plane");
        const meshFilter = new MeshFilter(planeMesh);
        const meshRenderer = new MeshRenderer();
        const material = new PBRMaterial();
        meshRenderer.material = material;
        planeGameObject.addComponentInstance(meshRenderer);
        planeGameObject.addComponentInstance(meshFilter);
        return planeGameObject;
    }
 
    public static createSunLight(): GameObject {
        const lightGameObject = new GameObject();
        lightGameObject.transform.rotation =  Quaternion.fromEulerAnglesVector3(new Vector3(90, 0, 0)); 
        lightGameObject.transform.position = new Vector3(0, 5, 0);
        const lightComponent = new DirecionalLight();
        lightComponent.setGameObject(lightGameObject);
        lightGameObject.addComponentInstance(lightComponent);
        return lightGameObject;
    }

    public static createAmbientLight(color?: Color): GameObject {
        const lightGameObject = new GameObject();
        const lightComponent = new AmbientLight(color);
        lightComponent.setGameObject(lightGameObject);
        lightGameObject.addComponentInstance(lightComponent);
        return lightGameObject;
    }
}
