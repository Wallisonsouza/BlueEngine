import GameObject from "../Engine/components/GameObject";
import Transform from "./Transform";
import { NullReferenceException } from "../Engine/static/Error";
import Entity from "../Engine/components/Entity";

export default class Component extends Entity {

    public active: boolean = true;

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

    public get identifier(): string {
        return this._identifier;
    }

    private _identifier: string ;
    private _gameObject: GameObject | null = null;

    constructor(identifier: string = "new Component", active: boolean = true, gameObject: GameObject | null = null) {
        super();
        this._identifier = identifier;
        this.active = active;
        this._gameObject = gameObject;
    }

    public setGameObject(gameObject: GameObject) {
        this._gameObject = gameObject;
    }

    public drawGizmos(): void {}
}