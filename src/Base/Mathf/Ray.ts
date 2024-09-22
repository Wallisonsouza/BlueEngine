import Vector3 from "../../../engine_modules/vectors/Vector3";

export default class Ray {
    origin: Vector3; 
    direction: Vector3;

    constructor(origin: Vector3, direction: Vector3) {
        this.origin = origin;
        this.direction = direction.normalize(); 
    }
        
    // static rayIntersectsLine(ray: Ray, start: Vector3, end: Vector3): boolean {
    //     const lineDir = end.subtract(start);
    //     const rayDir = ray.direction;
    //     const rayToLineStart = start.subtract(ray.origin);
    
    //     const denominator = rayDir.cross(lineDir).magnitude();
    
    //     if (denominator === 0) {
    //         // Linhas paralelas
    //         return false;
    //     }
    
    //     const t = rayToLineStart.cross(lineDir).magnitude() / denominator;
    //     const u = rayToLineStart.cross(rayDir).magnitude() / denominator;
    
    //     // Verifique se t e u estão dentro dos limites
    //     return (t >= 0 && t <= 1) && (u >= 0);
    // }
    
    // intersectsRotatedBox(size: Vec3,  rotation: Quat, boxPosition: Vec3 = Vec3.zero): Vec3 | null {
       
    //     const invRotation = Quat.inverse(rotation);
    //     const localOrigin = Quat.multiplyVec3(invRotation, this.origin.subtract(boxPosition));
    //     const localDirection = Quat.multiplyVec3(invRotation, this.direction);
    
    //     // Calcular interseção com a caixa axis-aligned no espaço local
    //     let tmin = (-size.x - localOrigin.x) / localDirection.x;
    //     let tmax = (size.x - localOrigin.x) / localDirection.x;
    
    //     if (tmin > tmax) [tmin, tmax] = [tmax, tmin];
    
    //     let tymin = (-size.y - localOrigin.y) / localDirection.y;
    //     let tymax = (size.y - localOrigin.y) / localDirection.y;
    
    //     if (tymin > tymax) [tymin, tymax] = [tymax, tymin];
    
    //     if (tmin > tymax || tymin > tmax) return null;
    
    //     if (tymin > tmin) tmin = tymin;
    //     if (tymax < tmax) tmax = tymax;
    
    //     let tzmin = (-size.z - localOrigin.z) / localDirection.z;
    //     let tzmax = (size.z - localOrigin.z) / localDirection.z;
    
    //     if (tzmin > tzmax) [tzmin, tzmax] = [tzmax, tzmin];
    
    //     if (tmin > tzmax || tzmin > tmax) return null;
    
    //     // Encontrar o ponto de colisão mais próximo no espaço local
    //     const collisionPointLocal = localOrigin.add(localDirection.scale(tmin));
    
    //     // Transformar o ponto de colisão de volta para o espaço global
    //     const collisionPointGlobal = Quat.multiplyVec3(rotation, collisionPointLocal).add(boxPosition);
    
    //     return collisionPointGlobal;
    // }
    
    // drawRayAndBox(size: Vec3, rotation: Quat, boxPosition: Vec3 = Vec3.zero) {
    //     Gizmos.drawWireCube(boxPosition, size.scale(2), rotation);
    // }

}

export class LineSegment {
    start: Vector3;
    end: Vector3;

    constructor(start: Vector3, end: Vector3) {
        this.start = start;
        this.end = end;
    }
}
