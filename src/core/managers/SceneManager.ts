import GameObject from "../components/GameObject";
import Light from "../components/light/Light";
import LightManager from "../components/light/LightManager";
import Renderer from "../components/Renderer";
import Scene from "../components/Scene";
import { NullReferenceException } from "../Error";
import RendererManager from "./RendererManager";

export default class SceneManager {
    private static _scenes: Scene[] = [];
    private static _currentScene: Scene | null = null;

    public static addScene(scene: Scene): void {
        if (!this._scenes.includes(scene)) {
            this._scenes.push(scene);
            this.setCurrentScene(scene);
        } 
    }

    public static getSceneByIndex(index: number): Scene | null {
        return this._scenes[index] || null;
    }
  
    public static getSceneByName(name: string): Scene | null {
        return this._scenes.find(scene => scene.name === name) || null;
    }

  
    public static getAllScenes(): Scene[] {
        return this._scenes;
    }


    public static removeScene(scene: Scene): void {
        const index = this._scenes.indexOf(scene);
        if (index > -1) {
            this._scenes.splice(index, 1);
        }
    }

    public static setCurrentScene(scene: Scene): void {
        this._currentScene = scene;
    }

    public static getCurrentScene(): Scene {
        if (!this._currentScene) {
            const exception = new NullReferenceException(
                "SceneManager", 
                "Falha ao acessar a cena atual.", 
                "A cena pode não ter sido inicializada corretamente. Verifique se 'setCurrentScene' foi chamado antes de 'getCurrentScene'."
            );
            console.error(exception.message); // Logar o erro no console
            throw exception; // Lançar a exceção personalizada
        }
        return this._currentScene;
    }

    public static loadSceneByName(name: string): void {
        const scene = this.getSceneByName(name);
        if (scene === null) {
            return;
        }
        this.setCurrentScene(scene);
    }

    public static getAllGameObjects() {
        const scene = this.getCurrentScene();
        return scene.getAllGameObjects();
    }

    public static getGameObjectByName(name: string) {
        return this._currentScene?.getGameObjectByName(name);
    }

    public static getGameObjectByTag(tag: string) {
       return this._currentScene?.getGameObjectsByTag(tag)[0];
      
    }

    public static addGameObject(newGameObject: GameObject) {

        const lights = newGameObject.getComponentByGroup<Light>("Light");
        if(lights) {
            lights.forEach( l => {
                LightManager.addLight(l);
            })
        }

        const renderers = newGameObject.getComponentByGroup<Renderer>("Renderer");
        if(renderers) {
            for(const renderer of renderers) {
                RendererManager.addRenderer(renderer);
            }
        }
       
       this._currentScene?.addGameObject(newGameObject);
    }


    public static addGameObjects(gameObjects: GameObject[]) {
        for(const gameObject of gameObjects) {
            this.addGameObject(gameObject);
        }
    }
}