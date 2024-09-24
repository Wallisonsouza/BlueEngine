import Transform from "../../components/Transform";
import Component from "../../components/Component";
import Entity from "./Entity";
import List from "./List";
import { ComponentAlreadyExistsException } from "../static/Error";

export default class GameObject extends Entity {
    
    public layer: number;
    public active: boolean;
    public tag: string;
    public name: string;
    private components: List<Component>;
    public transform: Transform = new Transform();

    constructor(name?: string, tag?: string, layer?: number, active?: boolean) {
        super();
        
        this.components = new List<Component>();
        this.name = name ?? "new GameObject";
        this.tag = tag ?? "Untagged";
        this.layer = layer ?? 0;
        this.active = active ?? true; 
        this.transform.setGameObject(this);
        this.components.add(this.transform);
    }

    /**
     * Adiciona um componente à lista de componentes do GameObject.
     * @param componentInstance - A instância do componente a ser adicionado. 
     */
    public addComponentInstance(componentInstance: Component): void {

        if(componentInstance instanceof Transform)  {
            throw new ComponentAlreadyExistsException(`O componente "${componentInstance.identifier}" ja existe no objeto`);
        }

        if (!this.components.contains(componentInstance)) {
            componentInstance.setGameObject(this);
            this.components.add(componentInstance);
        } 
    }

    /**
     * Adiciona um componente ao GameObject.
     * @param type - O tipo do componente a ser adicionado.
     * @returns A instância do componente adicionado
     */
    public addComponent<T extends Component>(type: new () => T): T {
        const component = new type();

       
        this.addComponentInstance(component);
        return component;
    }

    /**
     * Retorna um componente do tipo especificado.
     * @param type - O tipo do componente a ser retornado.
     * @returns O componente do tipo especificado ou null se não encontrado.
     */
    public getComponent<T extends Component>(type: new () => T): T | null {
        return this.components.findFirst(component => component instanceof type) as T || null;
    }

    /**
     * Retorna todos os componentes do tipo especificado.
     * @param type - O tipo do componente a ser retornado.
     * @returns Uma lista de componentes do tipo especificado.
     */
    public getComponents<T extends Component>(type: new () => T): List<T> {
        return this.components.findAll(component => component instanceof type) as List<T>;
    }

    /**
     * Remove um componente do GameObject.
     * @param type - O tipo do componente a ser removido.
     */
    public removeComponent<T extends Component>(type: new () => T): void {
        this.components.removeFirst(component => component instanceof type);
    }

    /**
     * Remove todos os componentes do tipo especificado.
     * @param type - O tipo dos componentes a serem removidos.
     */
    public removeComponents<T extends Component>(type: new () => T): void {
        this.components.removeAll(component => component instanceof type);
    }

    /**
     * Verifica se o GameObject possui um componente do tipo especificado.
     * @param type - O tipo do componente a ser verificado.
     * @returns Verdadeiro se o componente estiver presente, falso caso contrário.
     */
    public hasComponent<T extends Component>(type: new () => T): boolean {
        return this.getComponent(type) !== null;
    }

  
    public toString(): string {
        return `
            GameObject: ${this.name}
            Layer: ${this.layer}
            Active: ${this.active}
            Tag: ${this.tag}
        `;
    }
}

//     /**
//  * Adiciona uma lista de componentes à lista de componentes do GameObject.
//  * @param componentInstances - A lista de instâncias de componentes a serem adicionadas.
//  */
//     public addComponentInstances(componentInstances: List<Component>): void {
//         this.components.addListRange(componentInstances);
//     }
//     /**
//      * Adiciona uma lista de componentes ao GameObject.
//      * @param types - A lista de tipos de componentes a serem adicionados.
//      * @returns A lista de instâncias de componentes adicionadas.
//      */
//     public addComponents<T extends Component>(types: (new () => T)[]): T[] {
//         const components = types.map(type => new type());
//         this.addComponentInstances(new List(components));
//         return components;
//     }
    