import Transform from "./Transform";
import GameObject from "./GameObject";
import { NullReferenceException } from "../Error";
import LifeCycle from "./LifeCycle";

export default class Component extends LifeCycle {

    public isActive: boolean = true;
   
    public isSelected = false;
    private _gameObject: GameObject | null = null;

    public get gameObject(): GameObject {
        if(!this._gameObject) {
            throw new NullReferenceException("[Component]", "GameObject não está atribuído.");
        }
        return this._gameObject;
    }

    public get transform(): Transform {
        if (!this._gameObject) {
            throw new NullReferenceException("[Component]", "GameObject não está atribuído. Não é possível acessar o transform.");
        }

        return this._gameObject.transform;
    }


    private _type: string;
    private _group: string;
    public get type(): string { return this._type;}
    public get group(): string { return this._group;}
        
    

    constructor(
        type: string, 
        group: string,
        active: boolean = true, 
        gameObject: GameObject | null = null
    ) {
        super();
        this._type = type;
        this._group = group;
        this.isActive = active;
        this._gameObject = gameObject;
    }
    
  
    public setGameObject(gameObject: GameObject) {
        this._gameObject = gameObject;
    }
}
