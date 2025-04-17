import Material from "../material/Material";

export default class MaterialManager {
    private static materials: Map<number, Material> = new Map();

    // Obtém um material pelo seu ID
    public static get(id: number): Material | null {
        return this.materials.get(id) ?? null;
    }

    // Remove um material pelo ID
    public static remove(id: number): boolean {
        return this.materials.delete(id);
    }

    // Verifica se um material existe pelo ID
    public static has(id: number): boolean {
        return this.materials.has(id);
    }

    // Limpa todos os materiais
    public static clear(): void {
        this.materials.clear();
    }

    // Retorna todos os materiais como um array
    public static getAll(): Material[] {
        return [...this.materials.values()];
    }

    // Adiciona um material pelo ID
    public static add(id: number, material: Material): boolean {
        if (this.materials.has(id)) {
            console.warn(`Material with ID ${id} already exists.`);
            return false; // O material já existe, não vamos adicioná-lo
        }

        this.materials.set(id, material);
        return true; // Material adicionado com sucesso
    }
}
