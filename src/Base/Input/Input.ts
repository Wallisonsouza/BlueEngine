import { KeyCode } from "../../Engine/Enum/KeyCode";
import Vector3 from "../../../engine_modules/vectors/Vector3";
import KeyInput from "./KeyInput";
import MouseInput from "./MouseInput";

export default class Input {
    public static start(): void {
        KeyInput.initialize();
        MouseInput.initialize();
    }

    public static clearInputs(): void {
        KeyInput.clear();
        MouseInput.clear();
    }

    public static getMousePosition(): Vector3 {

        const pos = MouseInput.getPosition();
        return  new Vector3(pos.x, pos.y, 0);
    }

    public static getMouseMovement(): { x: number, y: number } {
        return MouseInput.getMovement();
    }


    public static onScroll(callback: (delta: { x: number, y: number }) => void): void {
        MouseInput.onScroll(callback);
    }

    public static getKeyDown(key: KeyCode): boolean {
        return KeyInput.getKeyDown(key);
    }
    public static getKey(key: KeyCode): boolean {
        return KeyInput.getKey(key);
    }
    public static getKeyUp(key: KeyCode): boolean {
        return KeyInput.getKeyUp(key);
    }

    public static getMouseButtonDown(button: number): boolean {
        return MouseInput.getMouseButtonDown(button);
    }
    public static getMouseButton(button: number): boolean {
        return MouseInput.getMouseButton(button);
    }
    public static getMouseButtonUp(button: number): boolean {
        return MouseInput.getMouseButtonUp(button);
    }
}
