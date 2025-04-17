import Shader from "../graphics/shaders/Shader";
import LoadResources from "./LoadResources";

export default class ShaderManager {
    private static _shaderCache: Map<string, Shader> = new Map();

    public static getShader(name: string): Shader | null {
        return this._shaderCache.get(name) ?? null;
    }

    public static setShader(shader: Shader): void {
        this._shaderCache.set(shader.name, shader);
    }

    public static removeShader(name: string): boolean {
        if (!this._shaderCache.has(name)) {
            console.warn(`O shader com o nome "${name}" não existe no cache.`);
            return false;
        }
        this._shaderCache.delete(name);
        return true;
    }

    public static async createShader(
        vertSourceUrl: string, 
        fragSourceUrl: string, 
        name: string = "Novo Shader"
    ) {
        if (this._shaderCache.has(name)) {
            console.warn(`Um shader com o nome "${name}" já existe. Retornando o shader armazenado no cache.`);
            return Promise.resolve(this._shaderCache.get(name) ?? null);
        }
    
        const vert = await LoadResources.loadTextFile(vertSourceUrl);
        const frag = await LoadResources.loadTextFile(fragSourceUrl);
        const shader = new Shader(name, vert, frag);
        this.setShader(shader); 
        
        return shader;
    }
    

    public static listShaders(): string[] {
        return Array.from(this._shaderCache.keys());
    }

    public static getAllShaders(): IterableIterator<Shader> {
        return this._shaderCache.values();
    }

}
