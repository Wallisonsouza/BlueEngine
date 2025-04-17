// import Vector3 from "../math/Vector3";
// import Bounds from "./Bounds";
// import Collider from "./Collider";
// import Frustum from "./Frustum";

// export default class AABB extends Collider {
//     private bounds: Bounds;

//     constructor(center: Vector3, size: Vector3) {
//         super("AABB");
//         this.bounds = new Bounds(center, size);
//     }

//     public expand(amount: number): void {
//         this.bounds.expand(amount); 
//     }
  
//     public contains(point: Vector3): boolean {
//         //atualizar depois alerta de pesado que nem sua mae
//         this.bounds.applyTransformation(this.transform);
//         return this.bounds.contains(point);  
//     }

//     public isInFrustum(frustum: Frustum): boolean {
//         const min = this.bounds.min;
//         const max = this.bounds.max;

//         for (let plane of frustum.planes) {
//             const minSide = plane.normal.dot(min) + plane.d;
//             const maxSide = plane.normal.dot(max) + plane.d;

//             if (minSide > 0 && maxSide > 0) {
//                 return false;
//             }
//         }

//         return true;
//     }
  
//     public intersects(other: AABB): boolean {
//         this.bounds.applyTransformation(this.transform);
//         return this.bounds.intersects(other.bounds);  
//     }

//     public get extents(): Vector3 {
//         return this.bounds.extents;
//     }

//     public get center(): Vector3 {
//         return this.bounds.center;
//     }

//     public get size(): Vector3 {
//         return this.bounds.size;
//     }

//     public get min(): Vector3 {
//         return this.bounds.min;
//     }

//     public get max(): Vector3 {
//         return this.bounds.max;
//     }
// }
