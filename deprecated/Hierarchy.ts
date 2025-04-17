// import GameObject from "./GameObject";
// import ObjectManager from "../managers/ObjectManager";

// export default class Hierarchy {
    
//     _objects: ObjectManager<GameObject> = new ObjectManager();  

//     // Adiciona um único objeto de jogo à hierarquiaa
//     public addGameObject(entity: GameObject): void {
//         const { id, name, tag } = entity;
//         this._objects.addObject(id, name, [tag], entity);
//     }

//     // Adiciona vários objetos de jogo
//     public addGameObjects(entities: GameObject[]): void {
//         entities.forEach(entity => this.addGameObject(entity));
//     }

//     // Retorna todos os objetos de jogo
//     public getAllGameObjects(): GameObject[] {
//         return this._objects.getAllObjectsArray();
//     }

//     // Retorna um objeto de jogo pelo ID
//     public getGameObjectById(id: number): GameObject | null {
//         return this._objects.getById(id) ?? null;
//     }

//     // Retorna um objeto de jogo pelo nome
//     public getGameObjectByName(name: string): GameObject | undefined {
//         return this._objects.getFirstByName(name);
//     }

//     // Retorna o primeiro objeto de jogo com uma tag específica
//     public getFirstGameObjectByTag(tag: string): GameObject | undefined {
//         return this._objects.getFirstObjectByTag(tag);
//     }

//     // Retorna todos os objetos de jogo com uma tag específica
//     public getGameObjectsByTag(tag: string): GameObject[] {
//         return this._objects.getByTag(tag);
//     }

//     public get count(){
//         return this._objects.count;
//     }

// }
