import { ObjectManager } from "../managers/ObjectManager";
import Entity from "./Entity";
import GameObject from "./GameObject";

export default class Scene extends Entity {    

    public name: string;
    private _gameObjects: ObjectManager<GameObject> = new ObjectManager();

    constructor(name: string = "New scene") {
        super();
        this.name = name;
    }

    public addGameObject(gameObject: GameObject) {
        this._gameObjects.addObject(gameObject.id.value, gameObject, undefined, gameObject.name, gameObject.tag, undefined);
    }
    
    public addGameObjects(gameObjects: GameObject[]) {
        for (const gameObject of gameObjects) {
            this.addGameObject(gameObject);
        }
    }

    public getAllGameObjects(): GameObject[] {
        return Array.from(this._gameObjects.getObjects());
    }

    public getGameObjectById(id: number): GameObject | null {
        return this._gameObjects.getObjectById(id) ?? null;
    }

    public getGameObjectByName(name: string): GameObject | null {
        return this._gameObjects.getObjectsByName(name) ?? null;
    }

    public getGameObjectsByTag(tag: string): GameObject[] {
        return this._gameObjects.getObjectsByTag(tag);
    }
}