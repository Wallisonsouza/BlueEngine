export default class Entity {
    private static currentId: number = 0;
    public id: number;

    constructor() {
        this.id = Entity.generateId();
    }

    private static generateId(): number {
        return Entity.currentId++;
    }
    
    destroy(): void {
        throw new Error("Método não implementado");
    }
}
