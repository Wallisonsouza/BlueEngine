import GameObject from "../../components/GameObject";
import MeshFilter from "../../components/MeshFilter";
import PBRMaterial from "../../graphics/material/pbr/PBR_Material";
import MeshRenderer from "../../graphics/mesh/MeshRenderer";
import MeshManager from "../../managers/MeshManager";

export default class SphereObject {

    public static create(): GameObject {
        const sphere = new GameObject();
        const mesh = MeshManager.getByName("sphere");
        const meshFilter = new MeshFilter(mesh);
        const meshRenderer = new MeshRenderer();
        const material = new PBRMaterial();
        meshRenderer.material = material;
        sphere.addComponentInstance(meshRenderer);
        sphere.addComponentInstance(meshFilter);
        return sphere;
    }

}