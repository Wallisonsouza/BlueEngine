import GameObject from "../components/GameObject";
import Transform from "../graphycs/Transform";
import { NullReferenceException } from "../static/Error";
import Entity from "./Entity";

export default class Component extends Entity {

    public active: boolean = true;
    public identifier: string = "Component";

    private priv_gameObject: GameObject | null = null;

    public get gameObject(): GameObject | null {
        if(!this.priv_gameObject) {
            throw new NullReferenceException("GameObject não está atribuído.");
        }
        return this.priv_gameObject;
    }

    public get transform(): Transform {
        if (!this.priv_gameObject) {
            throw new NullReferenceException("GameObject não está atribuído. Não é possível acessar o transform.");
        }

        return this.priv_gameObject.transform;
    }

    constructor(identifier: string = "Component", active: boolean = true) {
        super();
        this.identifier = identifier;
        this.active = active;
    }

    public setGameObject(gameObject: GameObject) {
        this.priv_gameObject = gameObject;
    }
    public drawGizmos(): void {
        this.transform.drawGizmos();
    }
   
}