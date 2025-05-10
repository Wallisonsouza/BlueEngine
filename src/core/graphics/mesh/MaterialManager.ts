import Material from "../material/Material";

export default class MaterialManager {
    private static materials: Map<number, Material> = new Map();

    public static get(id: number): Material | null {
        return this.materials.get(id) ?? null;
    }

    public static remove(id: number): boolean {
        return this.materials.delete(id);
    }

    public static has(id: number): boolean {
        return this.materials.has(id);
    }

    public static clear(): void {
        this.materials.clear();
    }

    public static getAll(): Material[] {
        return [...this.materials.values()];
    }

    public static add(id: number, material: Material): boolean {
        if (this.materials.has(id)) {
            console.warn(`Material with ID ${id} already exists.`);
            return false;
        }

        this.materials.set(id, material);
        return true;
    }
}
