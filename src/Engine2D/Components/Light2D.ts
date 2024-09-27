import Vector2 from "../../../engine_modules/vectors/Vector2";
import Vector3 from "../../../engine_modules/vectors/Vector3";
import Gizmos from "../../Engine/graphycs/Gizmos";
import Color from "../../Engine/static/color";

export default class PointLight2D {
    public color: Color = Color.white;
    public intensity: number = 1;
    public radius: number = 1;
    public position: Vector2 = new Vector2(0, 0);

    public drawGizmos() {
       
        Gizmos.color = this.color;

        const segments = 32; 
        const angleStep = (Math.PI * 2) / segments;

        for (let i = 0; i < segments; i++) {
            const theta1 = i * angleStep;
            const theta2 = (i + 1) * angleStep;

            const x1 = this.position.x + Math.cos(theta1) * this.radius /2;
            const y1 = this.position.y + Math.sin(theta1) * this.radius/ 2;
            const x2 = this.position.x + Math.cos(theta2) * this.radius/ 2;
            const y2 = this.position.y + Math.sin(theta2) * this.radius/ 2;

            Gizmos.drawLine(new Vector3(x1, y1, 0), new Vector3(x2, y2, 0), Color.yellow);
        }
    }
}
