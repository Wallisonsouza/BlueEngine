import Time from "../Time";
import Mathf from "../math/Mathf";
import KeyInput from "./KeyInput";

export class AxisInput {

    private static keySettings: { [key: string]: { value: number; duration: number } } = {
        "d": { value: 0, duration: 1 },
        "a": { value: 0, duration: 1 },
        "w": { value: 0, duration: 1 }, 
        "s": { value: 0, duration: 1 },
        "ArrowRight": { value: 0, duration: 1 },
        "ArrowLeft": { value: 0, duration: 1 },
        "ArrowUp": { value: 0, duration: 1 },
        "ArrowDown": { value: 0, duration: 1 }
    };

    private static interpolateKey(key: string, targetValue: number, deltaTime: number): void {
        if (KeyInput.getKey(key)) {
            this.keySettings[key].value = Mathf.lerp(
                this.keySettings[key].value,
                targetValue,
                deltaTime / this.keySettings[key].duration
            );
        } else {
            this.keySettings[key].value = Mathf.lerp(
                this.keySettings[key].value,
                0,
                deltaTime / this.keySettings[key].duration
            );
        }
    }


    public static getAxis(axis: string) {
        const deltaTime = Time.deltaTime;

        if (axis === "Horizontal") {
            this.interpolateKey("ArrowLeft", 1, deltaTime);
            this.interpolateKey("ArrowRight", 1, deltaTime); 
            return this.keySettings["ArrowRight"].value - this.keySettings["ArrowLeft"].value;
        } 
        
        if (axis === "Vertical") {
            this.interpolateKey("w", 1, deltaTime); 
            this.interpolateKey("s", 1, deltaTime); 
            this.interpolateKey("ArrowUp", 1, deltaTime); 
            this.interpolateKey("ArrowDown", 1, deltaTime);

            const verticalInput = (this.keySettings["w"].value + this.keySettings["ArrowUp"].value) 
                                - (this.keySettings["s"].value + this.keySettings["ArrowDown"].value);

            return verticalInput;
        }

        return 0;
    }
}
