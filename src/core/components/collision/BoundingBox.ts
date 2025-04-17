import Vector3 from "../../math/Vector3";
import Ray from "../../physics/Ray";

export default class BoundingBox {
    public min: Vector3;
    public max: Vector3;

    constructor(min: Vector3, max: Vector3) {
        this.min = min;
        this.max = max;
    }

    public getCorners(): Vector3[] {
        return  [
            new Vector3(this.min.x, this.min.y, this.min.z),   // Canto 0
            new Vector3(this.min.x, this.min.y, this.max.z),   // Canto 1
            new Vector3(this.min.x, this.max.y, this.min.z),   // Canto 2
            new Vector3(this.min.x, this.max.y, this.max.z),   // Canto 3
            new Vector3(this.max.x, this.min.y, this.min.z),   // Canto 4
            new Vector3(this.max.x, this.min.y, this.max.z),   // Canto 5
            new Vector3(this.max.x, this.max.y, this.min.z),   // Canto 6
            new Vector3(this.max.x, this.max.y, this.max.z)    // Canto 7
        ];
    }

    // Verifica se um ponto está dentro da BoundingBox
    public contains(point: Vector3): boolean {
        return (
            point.x >= this.min.x && point.x <= this.max.x &&
            point.y >= this.min.y && point.y <= this.max.y &&
            point.z >= this.min.z && point.z <= this.max.z
        );
    }

    // Verifica se outra BoundingBox está totalmente dentro da BoundingBox
    public containsBoundingBox(other: BoundingBox): boolean {
        return (
            this.min.x <= other.min.x && this.max.x >= other.max.x &&
            this.min.y <= other.min.y && this.max.y >= other.max.y &&
            this.min.z <= other.min.z && this.max.z >= other.max.z
        );
    }

    // Verifica se um raio intersecta a BoundingBox
    public intersectRay(ray: Ray): boolean {
        let tMin = (this.min.x - ray.origin.x) / ray.direction.x;
        let tMax = (this.max.x - ray.origin.x) / ray.direction.x;

        if (ray.direction.x === 0) {
            tMin = -Infinity;
            tMax = Infinity;
        }

        if (tMin > tMax) [tMin, tMax] = [tMax, tMin];

        let tyMin = (this.min.y - ray.origin.y) / ray.direction.y;
        let tyMax = (this.max.y - ray.origin.y) / ray.direction.y;

        if (ray.direction.y === 0) {
            tyMin = -Infinity;
            tyMax = Infinity;
        }

        if (tyMin > tyMax) [tyMin, tyMax] = [tyMax, tyMin];

        if ((tMin > tyMax) || (tyMin > tMax)) return false;

        if (tyMin > tMin) tMin = tyMin;
        if (tyMax < tMax) tMax = tyMax;

        let tzMin = (this.min.z - ray.origin.z) / ray.direction.z;
        let tzMax = (this.max.z - ray.origin.z) / ray.direction.z;

        if (ray.direction.z === 0) {
            tzMin = -Infinity;
            tzMax = Infinity;
        }

        if (tzMin > tzMax) [tzMin, tzMax] = [tzMax, tzMin];

        return (tMin <= tzMax) && (tzMin <= tMax);
    }

    // Verifica a interseção entre duas BoundingBoxes
    public intersectBoundingBox(other: BoundingBox): boolean {
        return (
            this.min.x <= other.max.x &&
            this.max.x >= other.min.x &&
            this.min.y <= other.max.y &&
            this.max.y >= other.min.y &&
            this.min.z <= other.max.z &&
            this.max.z >= other.min.z
        );
    }
}
