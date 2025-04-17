import Color from "../../math/color";
import Vector3 from "../../math/Vector3";
import Ray from "../../physics/Ray";
import Component from "../Component";

export default abstract class Collider extends Component {
    public color: Color = Color.GREEN;

    constructor(type: string) {
        super(type, "Collider");
    }

    public abstract raycast(ray: Ray): Vector3 | null;
    public abstract isCollidingWith(other: Collider): any;
}