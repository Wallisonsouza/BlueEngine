import GameObject from "./GameObject";

export default class Hierarchy {
    
    private _gameObjects: Map<number, GameObject>;

    constructor() {
        this._gameObjects = new Map<number, GameObject>();
    }

    public addGameObject(entity: GameObject): void {
        this._gameObjects.set(entity.id, entity);
    }

    public addGameObjects(entities: GameObject[]): void {
        entities.forEach(entity => {
            if (!this._gameObjects.has(entity.id)) {
                this._gameObjects.set(entity.id, entity);
            }
        });
    }

    public deleteGameObject(entity: GameObject): void {
        if (this._gameObjects.has(entity.id)) {
            entity.destroy(); 
            this._gameObjects.delete(entity.id);
        }
    }

    public getGameObjects(): GameObject[] {
        return Array.from(this._gameObjects.values());
    }

    public getGameObjectById(id: number): GameObject | undefined {
        return this._gameObjects.get(id);
    }

    public getGameObjectByName(name: string): GameObject | undefined {
        return Array.from(this._gameObjects.values()).find(entity => entity.name === name);
    }

    public getGameObjectByTag(tag: string) {
        return Array.from(this._gameObjects.values()).find(entity => entity.tag === tag) ?? null;
    }
    
    public createGameObject(): GameObject {
        const entity = new GameObject();
        this.addGameObject(entity);
        return entity;
    }
}
