
import GameObject from "../components/GameObject";
import Vector3 from "../math/Vector3";

export default class RayCastData {
    public hit: boolean | null;
    public point: Vector3 | null;
    public distance: number | null;
    public object: GameObject | null;

    constructor(
        hit: boolean | null,
        point: Vector3 | null, 
        distance: number | null, 
        object: GameObject | null
    ) {
        this.hit = hit;
        this.point = point;
        this.distance = distance;
        this.object = object;
    }
}
