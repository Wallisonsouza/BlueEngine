import Time from "../Time";
import Mathf from "../math/Mathf";
import KeyInput from "./KeyInput";


export class AxisInput {

    // Configuração de interpolação para cada tecla
    private static keySettings: { [key: string]: { value: number; duration: number } } = {
        "d": { value: 0, duration: 1 },
        "a": { value: 0, duration: 1 },
        "w": { value: 0, duration: 1 },
        "s": { value: 0, duration: 1 }
    };

    // Função auxiliar para interpolação
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

    // Função principal para obter o eixo
    public static getAxis(axis: string) {
        const deltaTime = Time.deltaTime;

        if (axis === "Horizontal") {
            this.interpolateKey("d", 1, deltaTime);
            this.interpolateKey("a", 1, deltaTime); 
            return this.keySettings["d"].value - this.keySettings["a"].value;
        } 
        
        if (axis === "Vertical") {
            this.interpolateKey("s", 1, deltaTime);
            this.interpolateKey("w", 1, deltaTime);
            return this.keySettings["s"].value - this.keySettings["w"].value;
        }

        return 0;
    }
}