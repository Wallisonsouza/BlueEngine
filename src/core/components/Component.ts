import Transform from "./Transform";
import Object from "./Object";
import GameObject from "./GameObject";
import { NullReferenceException } from "../Error";

export default class Component extends Object {

    public active: boolean = true;
    private _type: string;
    protected _gameObject: GameObject | null = null;

    public get gameObject(): GameObject {
        if(!this._gameObject) {
            throw new NullReferenceException("GameObject não está atribuído.");
        }
        return this._gameObject;
    }
    public get transform(): Transform {
        if (!this._gameObject) {
            throw new NullReferenceException("GameObject não está atribuído. Não é possível acessar o transform.");
        }

        return this._gameObject.transform;
    }

    public get type(): string {
        return this._type;
    }

    constructor(
        identifier: string = "new Component", 
        active: boolean = true, 
        gameObject: GameObject | null = null
    ) {
        super();
        this._type = identifier;
        this.active = active;
        this._gameObject = gameObject;
    }
    
    public drawGizmos() {}
    
    public setGameObject(gameObject: GameObject) {
        this._gameObject = gameObject;
    }
}