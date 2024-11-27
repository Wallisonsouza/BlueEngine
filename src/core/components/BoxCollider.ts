import Ray from "../../core/physics/Ray";
import Collider from "../../core/components/Collider";
import Vector3 from "../../core/math/Vector3";
import Quaternion from "../../core/math/Quaternion";
import Gizmos from "../factory/Gizmos";
import Color from "../math/color";

export default class BoxCollider extends Collider {

    public center: Vector3 = Vector3.zero;
    public size: Vector3 =  new Vector3(1.0, 1.0, 1.0);

    constructor(){
        super("BoxCollider");
    }
    
    public raycast(ray: Ray): Vector3 | null {
        const invRotation = Quaternion.inverse(this.transform.rotation);
        const localOrigin = Quaternion.multiplyVec3(invRotation, ray.origin.subtract(this.transform.position.add(this.center)));
        const localDirection = Quaternion.multiplyVec3(invRotation, ray.direction);
        
       
        if (localDirection.x === 0 && localDirection.y === 0 && localDirection.z === 0) {
            return null;
        }
    
        // Usar um valor pequeno para evitar divisão por zero
        const dx = localDirection.x || 1e-6;
        const dy = localDirection.y || 1e-6;
        const dz = localDirection.z || 1e-6;

        const halfSize = this.size.divideScalar(2.0);
    
        // Cálculo para o eixo x
        let tmin = (-halfSize.x - localOrigin.x) / dx;
        let tmax = (halfSize.x - localOrigin.x) / dx;
    
        if (tmin > tmax) [tmin, tmax] = [tmax, tmin];
    
        // Cálculo para o eixo y
        let tymin = (-halfSize.y - localOrigin.y) / dy;
        let tymax = (halfSize.y - localOrigin.y) / dy;
    
        if (tymin > tymax) [tymin, tymax] = [tymax, tymin];
    
        // Verificações de interseção
        if (tmin > tymax || tymin > tmax) return null;
    
        // Ajuste tmin e tmax com base na direção y
        if (tymin > tmin) tmin = tymin;
        if (tymax < tmax) tmax = tymax;
    
        // Cálculo para o eixo z
        let tzmin = (-halfSize.z - localOrigin.z) / dz;
        let tzmax = (halfSize.z - localOrigin.z) / dz;
    
        if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];
    
        // Verificações finais de interseção
        if (tmin > tzmax || tzmin > tmax) return null;
    
        // Ajuste final de tmin e tmax
        if (tzmin > tmin) tmin = tzmin;
        if (tzmax < tmax) tmax = tzmax;
    
        // Calcule o ponto de colisão
        const collisionPointLocal = localOrigin.add(localDirection.scale(tmin));
        const collisionPointGlobal = Quaternion.multiplyVec3(this.transform.rotation, collisionPointLocal).add(this.transform.position.add(this.center));
    
        return collisionPointGlobal;
    }
    
    public isCollidingWith(other: BoxCollider): boolean {
        const thisBounds = this.getTransformedBounds();
        const otherBounds = other.getTransformedBounds();
    
        return (
            thisBounds.min.x <= otherBounds.max.x &&
            thisBounds.max.x >= otherBounds.min.x &&
            thisBounds.min.y <= otherBounds.max.y &&
            thisBounds.max.y >= otherBounds.min.y &&
            thisBounds.min.z <= otherBounds.max.z &&
            thisBounds.max.z >= otherBounds.min.z
        );
    }
    
    private getTransformedBounds(): { min: Vector3; max: Vector3 } {
        const halfSize = this.size.multiplyScalar(0.5);
        const center = this.transform.position.add(this.center);
    
        const vertices = [
            new Vector3(-halfSize.x, -halfSize.y, -halfSize.z),
            new Vector3(halfSize.x, -halfSize.y, -halfSize.z),
            new Vector3(-halfSize.x, halfSize.y, -halfSize.z),
            new Vector3(halfSize.x, halfSize.y, -halfSize.z),
            new Vector3(-halfSize.x, -halfSize.y, halfSize.z),
            new Vector3(halfSize.x, -halfSize.y, halfSize.z),
            new Vector3(-halfSize.x, halfSize.y, halfSize.z),
            new Vector3(halfSize.x, halfSize.y, halfSize.z),
        ].map(
            
            vertex => Quaternion.multiplyVec3(this.transform.rotation, vertex).add(center)
        );
    
        let min = vertices[0].clone();
        let max = vertices[0].clone();
    
        for (const vertex of vertices) {
            min = min.min(vertex);
            max = max.max(vertex);
        }
    
        return { min, max };
    }

    public drawGizmos(): void {
        const worldCenter = this.transform.position.add(this.center);
        Gizmos.color = Color.green;
        Gizmos.drawWireCube(worldCenter, this.size, this.transform.rotation);
    }
    
}