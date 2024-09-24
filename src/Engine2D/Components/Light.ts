import Component from "../../components/Component";
import GameObject from "../../Engine/components/GameObject";
import Gizmos from "../../Engine/graphycs/Gizmos";
import Color from "../../Engine/static/color";

export default class PointLight extends Component {

    public range: number;
    public intensity: number;

    constructor(gameObject: GameObject | null = null) {
        super("Light");
        this.range = 10;
        this.intensity = 1;
        if(!gameObject) return;
       this.setGameObject(gameObject);
    }

    public drawGizmos(): void {
        Gizmos.drawWireSphere(this.transform.position, this.transform.rotation, this.range, Color.yellow);
    }
}