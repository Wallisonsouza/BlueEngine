export default class Object {

    private _id: number;
    private static currentId: number = 0;

    public get id(): number {
        return this._id;
    }
    constructor() {
        this._id = Object.generateId();
    }

    private static generateId(): number {
        return Object.currentId++;
    }
    
    destroy(): void {
        throw new Error("Método não implementado");
    }
}
