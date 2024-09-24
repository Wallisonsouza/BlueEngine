export default class Entity {

    private _id: number;
    private static currentId: number = 0;

    public get id(): number {
        return this._id;
    }
    constructor() {
        this._id = Entity.generateId();
    }

    private static generateId(): number {
        return Entity.currentId++;
    }
    
    destroy(): void {
        throw new Error("Método não implementado");
    }
}
