import Scene from "../components/Scene";

/**
 * Gerencia as cenas dentro do motor de jogo, permitindo adicionar, remover, e trocar cenas.
 */
export default class SceneManager {
    private static _scenes: Scene[] = [];
    private static _currentScene: Scene = new Scene();

    /**
     * Adiciona uma nova cena ao gerenciador.
     * @param scene A cena a ser adicionada.
     */
    public static addScene(scene: Scene): void {
        if (!this._scenes.includes(scene)) {
            this._scenes.push(scene);
            this.setCurrentScene(scene);
        } 
    }

    /**
     * Retorna uma cena pelo índice.
     * @param index O índice da cena.
     * @returns A cena no índice especificado ou null se fora dos limites.
     */
    public static getSceneByIndex(index: number): Scene | null {
        return this._scenes[index] || null;
    }

    /**
     * Retorna uma cena pelo nome.
     * @param name O nome da cena.
     * @returns A cena com o nome especificado ou null se não encontrada.
     */
    public static getSceneByName(name: string): Scene | null {
        return this._scenes.find(scene => scene.name === name) || null;
    }

    /**
     * Retorna todas as cenas gerenciadas.
     * @returns Um array de todas as cenas.
     */
    public static getAllScenes(): Scene[] {
        return this._scenes;
    }

    /**
     * Remove uma cena do gerenciador.
     * @param scene A cena a ser removida.
     */
    public static removeScene(scene: Scene): void {
        const index = this._scenes.indexOf(scene);
        if (index > -1) {
            this._scenes.splice(index, 1);
        }
    }

    /**
     * Define a cena atual.
     * @param scene A cena a ser definida como atual.
     */
    public static setCurrentScene(scene: Scene): void {
        this._currentScene = scene;
    }

    /**
     * Retorna a cena atual.
     * @returns A cena atual.
     */
    public static getCurrentScene(): Scene {
        return this._currentScene;
    }

    /**
     * Carrega uma cena pelo nome, tornando-a a cena atual.
     * @param name O nome da cena a ser carregada.
     */
    public static loadSceneByName(name: string): void {
        const scene = this.getSceneByName(name);
        if (scene === null) {
            return;
        }
        this.setCurrentScene(scene);
    }
}