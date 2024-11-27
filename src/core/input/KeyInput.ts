export default class KeyInput {
    private static  keyState = new Map<string, boolean>();
    private static  keyDown = new Map<string, boolean>();
    private static  keyUp = new Map<string, boolean>();

    public static initialize(): void {
        document.addEventListener('keydown', this.handleKeyDown.bind(this));
        document.addEventListener('keyup', this.handleKeyUp.bind(this));
    }

    public static clear(): void {
        this.keyDown.clear();
        this.keyUp.clear();
    }

    public static getKeyDown(key: string): boolean {
        return this.getButtonState(this.keyDown, key);
    }

    public static getKey(key: string): boolean {
        return this.keyState.get(key) ?? false;
    }

    public static getKeyUp(key: string): boolean {
        return this.getButtonState(this.keyUp, key);
    }

    private static getButtonState(map: Map<string, boolean>, key: string): boolean {
        const state = map.get(key) ?? false;
        map.delete(key);
        return state;
    }

    private static handleKeyDown(e: KeyboardEvent): void {
        if (!this.keyState.get(e.key)) {
            this.keyState.set(e.key, true);
            this.keyDown.set(e.key, true);
        }
      
    }

    private static handleKeyUp(e: KeyboardEvent): void {
        this.keyState.set(e.key, false);
        this.keyUp.set(e.key, true);
    }
}