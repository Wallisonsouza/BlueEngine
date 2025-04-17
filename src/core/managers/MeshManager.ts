import Mesh from "../graphics/mesh/Mesh";

export default class MeshManager {
    private static _meshsById: Map<number, Mesh> = new Map();
    private static _idsByName: Map<string, number> = new Map();

    // Adiciona um objeto ao gerenciador, usando id e nome
    public static addMesh(mesh: Mesh): boolean {
        if (this._meshsById.has(mesh.id.value)) {
            console.error(`ID ${mesh.id} já está em uso. O objeto não será adicionado.`);
            return false;
        }

        if (this._idsByName.has(mesh.name)) {
            console.error(`O nome ${mesh.name} já está em uso. O objeto não será adicionado.`);
            return false;
        }

        this._meshsById.set(mesh.id.value, mesh);
        this._idsByName.set(mesh.name, mesh.id.value);

        return true;
    }

    // Busca o objeto pelo id
    public static getById(id: number): Mesh | undefined {
        return this._meshsById.get(id);
    }

    // Busca o objeto pelo nome (agora referenciando o id)
    public static getByName(name: string): Mesh | undefined {
        const id = this._idsByName.get(name);
        return id !== undefined ? this._meshsById.get(id) : undefined;
    }

    // Verifica se um objeto existe pelo id
    public static existsById(id: number): boolean {
        return this._meshsById.has(id);
    }

    // Verifica se um objeto existe pelo nome
    public static existsByName(name: string): boolean {
        return this._idsByName.has(name);
    }

    // Remove um objeto do gerenciador
    public static removeMesh(id: number): boolean {
        const mesh = this._meshsById.get(id);
        if (!mesh) return false;

        this._meshsById.delete(id);
        this._idsByName.delete(mesh.name);
        return true;
    }

    // Retorna todos os objetos como um array
    public static getAllMeshsArray(): Mesh[] {
        return [...this._meshsById.values()];
    }
}
