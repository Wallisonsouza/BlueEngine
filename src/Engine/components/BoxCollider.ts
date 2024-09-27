import Quaternion from "../../../engine_modules/vectors/Quaternion";
import Ray from "../../Base/Mathf/Ray";
import Vector3 from "../../../engine_modules/vectors/Vector3";
import Gizmos from "../graphycs/Gizmos";
import Collider from "../../Engine2D/Components/Collider";

export default class BoxCollider extends Collider {

    public center: Vector3 = Vector3.zero;
    public size: Vector3 =  new Vector3(0.5, 0.5, 0.5);

    constructor(){
        super("BoxCollider");
    }
    
    public raycast(ray: Ray): Vector3 | null {

        const invRotation = Quaternion.inverse(this.transform.rotation);
        const localOrigin = Quaternion.multiplyVec3(invRotation, ray.origin.subtract(this.transform.position.add(this.center)));
        const localDirection = Quaternion.multiplyVec3(invRotation, ray.direction);
    
        if (localDirection.x === 0 && (localOrigin.x < -this.size.x || localOrigin.x > this.size.x)) return null;
        if (localDirection.y === 0 && (localOrigin.y < -this.size.y || localOrigin.y > this.size.y)) return null;
        if (localDirection.z === 0 && (localOrigin.z < -this.size.z || localOrigin.z > this.size.z)) return null;
    
        let tmin = (-this.size.x - localOrigin.x) / (localDirection.x || 1e-6); 
        let tmax = (this.size.x - localOrigin.x) / (localDirection.x || 1e-6);
    
        if (tmin > tmax) [tmin, tmax] = [tmax, tmin];
    
        let tymin = (-this.size.y - localOrigin.y) / (localDirection.y || 1e-6);
        let tymax = (this.size.y - localOrigin.y) / (localDirection.y || 1e-6);
    
        if (tymin > tymax) [tymin, tymax] = [tymax, tymin];
    
        if (tmin > tymax || tymin > tmax) return null;
    
        if (tymin > tmin) tmin = tymin;
        if (tymax < tmax) tmax = tymax;
    
        let tzmin = (-this.size.z - localOrigin.z) / (localDirection.z || 1e-6);
        let tzmax = (this.size.z - localOrigin.z) / (localDirection.z || 1e-6);
    
        if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];
    
        if (tmin > tzmax || tzmin > tmax) return null;
    
        const collisionPointLocal = localOrigin.add(localDirection.scale(tmin));
        const collisionPointGlobal = Quaternion.multiplyVec3(this.transform.rotation, collisionPointLocal).add(this.transform.position.add(this.center));
    
        return collisionPointGlobal;
    }

    public drawGizmos(): void {
        const worldCenter = this.transform.position.add(this.center);
        Gizmos.color = this.color;
        Gizmos.drawWireCube(worldCenter, this.size.scale(2), this.transform.rotation);
    }
    
}