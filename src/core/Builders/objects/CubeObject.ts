import GameObject from "../../components/GameObject";
import MeshFilter from "../../components/MeshFilter";
import PBRMaterial from "../../graphics/material/pbr/PBR_Material";
import MeshRenderer from "../../graphics/mesh/MeshRenderer";
import MeshManager from "../../managers/MeshManager";

export default class CubeObject {
    
    public static create(name?: string ): GameObject {
        const cubeGameObject = new GameObject();
        cubeGameObject.name = name ? name : `New Cube_${cubeGameObject.id}`;
        const cubeMesh = MeshManager.getByName("cube");
        const meshFilter = new MeshFilter(cubeMesh);
        const meshRenderer = new MeshRenderer();
        const material = new PBRMaterial();
        meshRenderer.material = material;
        cubeGameObject.addComponentInstance(meshRenderer);
        cubeGameObject.addComponentInstance(meshFilter);
        return cubeGameObject;
    }

}