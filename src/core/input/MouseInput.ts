import Vector3 from "../math/Vector3";

export default class MouseInput {
    private static readonly buttonState = new Map<number, boolean>();
    private static readonly buttonDown = new Map<number, boolean>();
    private static readonly buttonUp = new Map<number, boolean>();
    private static position: Vector3 = Vector3.zero;
    private static movement: Vector3 = Vector3.zero;
    private static scrollDelta: Vector3 = Vector3.zero;
    private static scrollCallback: ((delta: { x: number, y: number }) => void) | null = null;

    public static initialize(): void {
        const canvas = document.getElementById('canvas') as HTMLCanvasElement; // Seleciona o canvas pelo ID

        document.addEventListener('mousedown', this.handleButtonDown.bind(this));
        document.addEventListener('mouseup', this.handleButtonUp.bind(this));
        document.addEventListener('mousemove', (e) => {
            const rect = canvas.getBoundingClientRect();
            MouseInput.position = new Vector3(e.clientX - rect.left, e.clientY - rect.top, 0);
            MouseInput.movement = new Vector3(e.movementX, e.movementY, 0);
          
        });
        document.addEventListener('wheel', this.handleScroll.bind(this));
    }

    public static clear(): void {
        this.buttonDown.clear();
        this.buttonUp.clear();
        MouseInput.movement = Vector3.zero;
        MouseInput.scrollDelta = Vector3.zero;
    }

    public static getMouseButtonDown(button: number): boolean {
        return this.buttonDown.get(button) ?? false;
    }

    public static getMouseButton(button: number): boolean {
        return this.buttonState.get(button) ?? false;
    }

    public static getMouseButtonUp(button: number): boolean {
        return this.buttonUp.get(button) ?? false;
    }

    private static handleButtonDown(e: MouseEvent): void {
        if (!this.buttonState.get(e.button)) {
            this.buttonState.set(e.button, true);
            this.buttonDown.set(e.button, true);
        }
    }

    private static handleButtonUp(e: MouseEvent): void {
        this.buttonState.set(e.button, false);
        this.buttonUp.set(e.button, true);
    }

    private static handleScroll(e: WheelEvent): void {
        MouseInput.scrollDelta = new Vector3(e.deltaX, e.deltaY, 0);
        if (MouseInput.scrollCallback) {
            MouseInput.scrollCallback(MouseInput.scrollDelta);
        }
    }

    public static getPosition() {
        return MouseInput.position;
    }

    public static getMovement() {
        return MouseInput.movement;
    }

    public static getScrollDelta() {
        return MouseInput.scrollDelta;
    }

    public static onScroll(callback: (delta: { x: number, y: number }) => void): void {
        MouseInput.scrollCallback = callback;
    }
}
