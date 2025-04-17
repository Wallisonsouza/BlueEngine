import GameObject from "../../src/core/components/GameObject";
import Scene from "../../src/core/components/Scene";
import SceneManager from "../../src/core/managers/SceneManager";
import SimpleScene from "./SimpleScene";

export function Main() {

    const scene = new Scene("Simple scene");
    SceneManager.addScene(scene);
    const Scripts = new GameObject();
    Scripts.addComponent(SimpleScene);
    scene.addGameObject(Scripts);

  
}