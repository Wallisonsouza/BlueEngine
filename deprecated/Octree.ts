// import Frustum from "./Frustum";
// import GameObject from "./GameObject";
// import MeshFilter from "./MeshFilter";
// import Vector3 from "../math/Vector3";
// import AABB from "./AABB";

// export default class Octree {
//     private objects: GameObject[] = [];
//     private children: Octree[] = [];
//     private isDivided: boolean = false;

//     constructor(public boundary: AABB, public capacity: number = 4) {}

//     insert(object: GameObject): boolean {
//         if (!this.boundary.contains(object.transform.position)) {
//             return false;
//         }

//         if (this.objects.length < this.capacity) {
//             this.objects.push(object);
//             return true;
//         }

//         if (!this.isDivided) {
//             this.subdivide();
//         }

//         for (let child of this.children) {
//             if (child.insert(object)) {
//                 return true;
//             }
//         }

//         return false; // Não deveria chegar aqui
//     }

//     private subdivide() {
//         const { min, max } = this.boundary;
//         const midX = (min.x + max.x) / 2;
//         const midY = (min.y + max.y) / 2;
//         const midZ = (min.z + max.z) / 2;

//         this.children.push(new Octree(new AABB(min, new Vector3(midX, midY, midZ)), this.capacity));
//         this.children.push(new Octree(new AABB(new Vector3(midX, min.y, min.z), new Vector3(max.x, midY, midZ)), this.capacity));
//         this.children.push(new Octree(new AABB(new Vector3(min.x, midY, min.z), new Vector3(midX, max.y, midZ)), this.capacity));
//         this.children.push(new Octree(new AABB(new Vector3(midX, midY, min.z), max), this.capacity));
//         this.children.push(new Octree(new AABB(new Vector3(min.x, min.y, midZ), new Vector3(midX, midY, max.z)), this.capacity));
//         this.children.push(new Octree(new AABB(new Vector3(midX, min.y, midZ), new Vector3(max.x, midY, max.z)), this.capacity));
//         this.children.push(new Octree(new AABB(new Vector3(min.x, midY, midZ), new Vector3(midX, max.y, max.z)), this.capacity));
//         this.children.push(new Octree(new AABB(new Vector3(midX, midY, midZ), max), this.capacity));

//         this.isDivided = true;
//     }

//     query(range: AABB, found: GameObject[] = []): GameObject[] {
//         if (!this.boundary.intersects(range)) {
//             return found; // Não há interseção
//         }

//         for (let object of this.objects) {
//             if (range.contains(object.transform.position)) {
//                 found.push(object);
//             }
//         }

//         if (this.isDivided) {
//             for (let child of this.children) {
//                 child.query(range, found);
//             }
//         }

//         return found;
//     }

//     queryFrustum(frustum: Frustum, found: GameObject[] = []): GameObject[] {
//         if (!this.boundary.intersectsFrustum(frustum)) {
//             return found; // Não há interseção
//         }

//         for (let object of this.objects) {

//             const box = object.getComponentByType<MeshFilter>("MeshFilter")?.getBoundingBox();
//             if(!box) continue;
//             if (frustum.isInFrustumBoundingBox(box)) {
//                 found.push(object);
//             }
//         }

//         if (this.isDivided) {
//             for (let child of this.children) {
//                 child.queryFrustum(frustum, found);
//             }
//         }

//         return found;
//     }
// }
