import GameObject from "../components/GameObject";
import Camera from "../components/Camera";
import MeshRenderer from "../graphics/mesh/MeshRenderer";
import Material3D from "../graphics/material/Material3D";
import MeshFactory from "./MeshFactory";
import { BufferManager } from "../managers/BufferManager";
import BoxCollider from "../components/BoxCollider";
import MeshFilter from "../components/MeshFilter";
import Vector3 from "../math/Vector3";

export default class GameObjectFactory {

    public static createCamera(): GameObject{
        const camera = new GameObject("new Camera");
        camera.addComponent(Camera);
        return camera;
    }

    public static createCube() {

        const cube = new GameObject("New Cube");

        const mesh = MeshFactory.createCube();

        const meshFilter = new MeshFilter(mesh);

        const meshRenderer = new MeshRenderer();
        const material = new Material3D();
        meshRenderer.material = material;

        const boxCollider = new BoxCollider();

        cube.addComponentInstance(meshRenderer);
        cube.addComponentInstance(meshFilter);
        cube.addComponentInstance(boxCollider);
        
        BufferManager.registerMesh(mesh);
        return cube;
    }


    public static createSphere() {
        const sphere = new GameObject("New Sphere");
        const mesh = MeshFactory.createSphere();
        const meshFilter = new MeshFilter(mesh);
        const meshRenderer = new MeshRenderer();
        const material = new Material3D();
        meshRenderer.material = material;
        sphere.addComponentInstance(meshRenderer);
        sphere.addComponentInstance(meshFilter);
        sphere.addComponent(BoxCollider);
        BufferManager.registerMesh(mesh);
        return sphere;
    }

    public static createPlane() {
        const cube = new GameObject("New Plane");
        const mesh = MeshFactory.createSubdividedPlane(100, 100, 100, 100)
        const meshFilter = new MeshFilter(mesh);
        const meshRenderer = new MeshRenderer();
        const material = new Material3D();
        meshRenderer.material = material;

        const boxCollider = new BoxCollider();
        boxCollider.size = new Vector3(50, 0, 50);
        cube.addComponentInstance(boxCollider);
        cube.addComponentInstance(meshRenderer);
        cube.addComponentInstance(meshFilter);
        BufferManager.registerMesh(mesh);
    
        return cube;
    }
    
}