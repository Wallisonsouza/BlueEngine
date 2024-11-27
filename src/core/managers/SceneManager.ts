import Scene from "../components/Scene";

export default class SceneManager {
    private static _scenes: Scene[] = [];
    private static _currentScene: Scene = new Scene();

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
        return this._currentScene;
    }

    public static loadSceneByName(name: string): void {
        const scene = this.getSceneByName(name);
        if (scene === null) {
            return;
        }
        this.setCurrentScene(scene);
    }
}