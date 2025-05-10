import GameObject from "../../components/GameObject";
import MeshFilter from "../../components/MeshFilter";
import PBRMaterial from "../../graphics/material/pbr/PBR_Material";
import MeshRenderer from "../../graphics/mesh/MeshRenderer";
import MeshManager from "../../managers/MeshManager";

export default class PlaneObject {
    public static create(name: string = "New Plane"): GameObject {
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
}