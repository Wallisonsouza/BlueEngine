import Renderer from "../components/Renderer";

export default class RendererManager {

    private static renderers: Map<number, Renderer> = new Map();
    
    private static opaqueRenderers: Map<number, Renderer> = new Map();

    public static addRenderer(renderer: Renderer): boolean {
        if (this.renderers.has(renderer.id.value)) {
            console.error(`ID ${renderer.id} já está em uso. O objeto não será adicionado.`);
            return false;
        }

        this.renderers.set(renderer.id.value, renderer);
        return true;
    }

    public static getById(id: number): Renderer | null {
        return this.renderers.get(id) ?? null;
    }

    public static getAll() {
        return this.renderers.values();
    }
}