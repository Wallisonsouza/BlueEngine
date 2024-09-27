import Ray from "../../Base/Mathf/Ray";
import Vector3 from "../../../engine_modules/vectors/Vector3";
import GameObject from "../../Engine/components/GameObject";

export class Physics {

    public static rayCast(origin: Vector3, direction: Vector3, maxDistance: number): RayCastData {
        const ray = new Ray(origin, direction.normalize());
        return new RayCastData(false, null, null, 0, null);
    } 
}

export class RayCastData {
    public hit: boolean;
    public point: Vector3 | null;
    public normal: Vector3 | null;
    public distance: number;
    public object: any | null;

    constructor(hit: boolean, point: Vector3 | null, normal: Vector3 | null, distance: number, object: GameObject | null) {
        this.hit = hit;
        this.point = point;
        this.normal = normal;
        this.distance = distance;
        this.object = object;
    }
}