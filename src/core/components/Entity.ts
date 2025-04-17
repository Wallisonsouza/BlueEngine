import Identifier from "./Identifier";

export default class Entity {
    private readonly _id: Identifier;

    public get id(): Identifier {
        return this._id;
    }

    constructor() {
        this._id = Identifier.create();
    }

    public destroy(): void {
        Identifier.recycle(this._id);
        console.log(`Destroyed entity with ${this._id}`);
    }
}
