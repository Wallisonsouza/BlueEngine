import Transform from "./Transform";
import Component from "./Component";
import Entity from "./Entity";
import { ComponentAlreadyExistsException } from "../Error";
import SceneManager from "../managers/SceneManager";
import { ObjectManager } from "../managers/ObjectManager";
import Camera from "./Camera";
import BufferHelper from "../managers/BufferHelper";

export default class GameObject extends Entity {
    
    public activeSelf: boolean;
    public activeInHierarchy: boolean;
    public tag: string;
    public name: string;
    public transform: Transform;
    private _components: ObjectManager<Component>;

    constructor(name?: string, tag?: string, active?: boolean) {
        super();
        this.name = name ??`game_object`;
        this.tag = tag ?? "untagged";
        this.activeSelf = active ?? true; 
        this.activeInHierarchy = true;
        this.transform = new Transform();
        this.transform.setGameObject(this);
        this._components = new ObjectManager();
      
        this._components.addObject(this.transform.id.value, this.transform, this.transform.type, undefined, undefined, this.transform.group);
    }

    public addComponentInstance(componentInstance: Component): void {
        componentInstance.setGameObject(this);

        if(componentInstance instanceof Transform)  {
            throw new ComponentAlreadyExistsException(`O componente "${componentInstance.type}" ja existe no objeto`);
        }

        if(componentInstance instanceof Camera)  {
            BufferHelper.createCameraBuffer(componentInstance);
        }


        this._components.addObject(
            componentInstance.id.value,
            componentInstance,
            componentInstance.type,
            undefined,
            undefined,
            componentInstance.group
        )
    }

    public addComponent<T extends Component>(type: new () => T): T {
        const component = new type();
        this.addComponentInstance(component);
        return component;
    }
 
    public getAllComponents() {
        return this._components.getObjects();
    }

    public getAllComponentsByType<T extends Component>(type: string) {
        return this._components.getObjectsByType(type) as T[];
    }

    public getComponentByType<T extends Component>(type: string) {
        return this._components.getObjectsByType(type)[0] as T;
    }
    public getComponentByGroup<T extends Component>(type: string) {
        return this._components.getObjectsByGroup(type) as T[];
    }

    destroy(): void {
        super.destroy();
        this.activeSelf = false;
        this.activeInHierarchy = false;
        SceneManager.getCurrentScene()
        console.log(`GameObject "${this.name}" destruído com sucesso.`);
    }
}
