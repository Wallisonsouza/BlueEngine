import Transform from "./Transform";
import Component from "./Component";
import Object from "./Object";
import List from "./List";
import Light from "./Light";
import { ComponentAlreadyExistsException } from "../Error";
import SceneManager from "../managers/SceneManager";


export default class GameObject extends Object {
    
    public activeSelf: boolean;
    public activeInHierarchy: boolean;
    public tag: string;
    public name: string;
    private components: List<Component>;
    public transform: Transform = new Transform();

    constructor(name: string = "New GameObject", tag?: string, active?: boolean) {
        super();
        this.components = new List<Component>();
        this.name = name ?? `GameObject ${this.id}`;
        this.tag = tag ?? "Untagged";
        this.activeSelf = active ?? true; 
        this.activeInHierarchy = true;
        this.transform.setGameObject(this);
        this.components.add(this.transform);
    }

    /**
     * Adiciona um componente à lista de componentes do GameObject.
     * @param componentInstance - A instância do componente a ser adicionado. 
     */
    public addComponentInstance(componentInstance: Component): void {

        componentInstance.setGameObject(this);

        if(componentInstance instanceof Transform)  {
            throw new ComponentAlreadyExistsException(`O componente "${componentInstance.type}" ja existe no objeto`);
        }

        if(componentInstance instanceof Light) {
            Light.addLight(componentInstance);
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
        const component = this.components.findFirst(
            component => component instanceof type
        ) as T || null;
        
        return component;
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
    public static getAllGameObjects() {
        const currentScene = SceneManager.getCurrentScene();
        const sceneHierarchy = currentScene.getHierarchy();
        const gameObjects = sceneHierarchy.getGameObjects();
        return gameObjects;
    }

    public static getGameObjectByName(name: string) {
        const currentScene = SceneManager.getCurrentScene();
        const sceneHierarchy = currentScene.getHierarchy();
        const gameObject = sceneHierarchy.getGameObjectByName(name);
        return gameObject;
    }

    public static getGameObjectByTag(tag: string) {
        const currentScene = SceneManager.getCurrentScene();
        const sceneHierarchy = currentScene.getHierarchy();
        const gameObject = sceneHierarchy.getGameObjectByTag(tag);
        return gameObject;
    }

    public static addGameObject(newGameObject: GameObject) {
        const currentScene = SceneManager.getCurrentScene();
        const sceneHierarchy = currentScene.getHierarchy();
        sceneHierarchy.addGameObject(newGameObject);
    }

    public static addGameObjects(newGameObject: GameObject[]) {
        const currentScene = SceneManager.getCurrentScene();
        const sceneHierarchy = currentScene.getHierarchy();
        sceneHierarchy.addGameObjects(newGameObject);
    }

}
