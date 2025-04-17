
import GameObject from "../components/GameObject";
import Vector3 from "../math/Vector3";

export default class RayCastData {
    public hit: boolean;
    public point: Vector3;
    public distance: number;
    public gameObject: GameObject;

    constructor(
        hit: boolean,
        point: Vector3, 
        distance: number, 
        object: GameObject
    ) {
        this.hit = hit;
        this.point = point;
        this.distance = distance;
        this.gameObject = object;
    }
}
