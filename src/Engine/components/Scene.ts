import Hierarchy from "./Hierarchy";

export default class Scene {    

    public name: string;
    private hierarchy: Hierarchy = new Hierarchy(); 

    constructor(name: string = "New scene") {
        this.name = name;
    }

    public getHierarchy(): Hierarchy {
        return this.hierarchy;
    }
}