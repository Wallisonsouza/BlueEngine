import Gizmos from "../factory/Gizmos";
import Color from "../math/color";
import Light from "./Light";

export default class DirecionalLight extends Light {
    constructor() {
        super();
    }

    public static angle: number = 0.0;
    
    public drawGizmos(): void {
        Gizmos.color = Color.yellow;
    
        const start = this.transform.position; 
        const lineLength = 5.0; 
        const end = this.transform.position.add(this.transform.forward.multiplyScalar(lineLength)); // Escala o vetor forward
    
        Gizmos.drawWireSphere(start, 1.0); 
        Gizmos.drawLine(start, end);
    }
    
}