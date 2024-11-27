import Ray from "./Ray";
import Mesh from "../graphics/mesh/Mesh";
import Transform from "../components/Transform";
import Quaternion from "../math/Quaternion";
import Vector3 from "../math/Vector3";

export default class RayCast {

    public static meshcast(ray: Ray, mesh: Mesh, transform: Transform): Vector3 | null {
        if (!mesh.triangles || !mesh.vertices) return null;
        
        const invRotation = Quaternion.inverse(transform.rotation);
        const localOrigin = Quaternion.multiplyVec3(invRotation, ray.origin.subtract(transform.position));
        const localDirection = Quaternion.multiplyVec3(invRotation, ray.direction).normalize();


        for (let i = 0; i < mesh.triangles.length; i += 3) {
            const v0Index = mesh.triangles[i] * 3;
            const v1Index = mesh.triangles[i + 1] * 3;
            const v2Index = mesh.triangles[i + 2] * 3;

            const v0 = new Vector3(mesh.vertices[v0Index], mesh.vertices[v0Index + 1], mesh.vertices[v0Index + 2]);
            const v1 = new Vector3(mesh.vertices[v1Index], mesh.vertices[v1Index + 1], mesh.vertices[v1Index + 2]);
            const v2 = new Vector3(mesh.vertices[v2Index], mesh.vertices[v2Index + 1], mesh.vertices[v2Index + 2]);

            const hit = this.intersectRayWithTriangle(localOrigin, localDirection, v0, v1, v2);

            if (hit) {
                return Quaternion.multiplyVec3(transform.rotation, hit.point).add(transform.position);
            }
        }

        return null; 
    }
    
    private static intersectRayWithTriangle(rayOrigin: Vector3, rayDirection: Vector3, v0: Vector3, v1: Vector3, v2: Vector3): { t: number, point: Vector3 } | null {
        const edge1 = v1.subtract(v0);
        const edge2 = v2.subtract(v0);
        const h = rayDirection.cross(edge2);
        const a = edge1.dot(h);

        if (Math.abs(a) < 1e-6) return null; // Paralelo ao triângulo

        const f = 1.0 / a;
        const s = rayOrigin.subtract(v0);
        const u = f * s.dot(h);

        if (u < 0.0 || u > 1.0) return null; // Fora do triângulo

        const q = s.cross(edge1);
        const v = f * rayDirection.dot(q);

        if (v < 0.0 || u + v > 1.0) return null; // Fora do triângulo

        const t = f * edge2.dot(q);

        if (t > 1e-6) {
            const point = rayOrigin.add(rayDirection.scale(t));
            return { t, point };
        }

        return null; // Sem interseção
    }
}
