import Vector3 from "../math/Vector3";
import Bounds from "./collision/Bounds";
import Plane from "./Plane";

export default class Frustum {
    public planes: Plane[] = [];

    
    public containsBox(corners: Vector3[]): boolean {
        
        for (const plane of this.planes) {
            let allOutside = true;

            for (const corner of corners) {
                const distance = plane.distanceToPoint(corner);

                if (distance >= 0) {
                    allOutside = false;
                    break; 
                }
            }

            if (allOutside) {
                return false; 
            }
        }
        return true;
    }
  
    public containsSphere(center: Vector3, radius: number): boolean {
        for (const plane of this.planes) {
            const distance = plane.distanceToPoint(center);

            if (distance < -radius) {
                return false;  
            }
        }
        return true;
    }
  
    public contains(bounds: Bounds): boolean {
       
        const radius = bounds.extents.magnitude();
        const isSphereInside = this.containsSphere(bounds.center, radius);

        if (isSphereInside) {
            const corners = bounds.getCorners();
            return this.containsBox(corners);
        }

        return false;
    }
}
