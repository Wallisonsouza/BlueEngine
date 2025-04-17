import Ray from "../../physics/Ray";
import Collider from "./Collider";
import Vector3 from "../../math/Vector3";
import Quaternion from "../../math/Quaternion";
import Gizmos from "../../../../deprecated/Gizmos";
import CollisionData from "./CollisionData";
import { RenderMode } from "../../enum/RenderMode";

enum CollisionEvent {
    ENTER,
    STAY,
    EXIT
}

export default class BoxCollider extends Collider {

    public center: Vector3 = Vector3.zero;
    public size: Vector3 = new Vector3(1.0, 1.0, 1.0);

    constructor(){
        super("BoxCollider");
    }
    
    public raycast(ray: Ray, epsilon: number = 1e-6): Vector3 | null {
        const invRotation = this.transform.rotation.inverse();
        const localOrigin = invRotation.multiplyVector3(ray.origin.subtract(this.transform.position.add(this.center)));
        const localDirection = invRotation.transformVector3(ray.direction);
        
        if(localDirection.equals(Vector3.zero)) {
            return null;
        }

     
        const dx = localDirection.x || epsilon;
        const dy = localDirection.y || epsilon;
        const dz = localDirection.z || epsilon;

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
        const collisionPointGlobal = Quaternion.multiplyVector3(this.transform.rotation, collisionPointLocal).add(this.transform.position.add(this.center));
    
        return collisionPointGlobal;
    }
    
    private isAxisOverlapping(minA: number, maxA: number, minB: number, maxB: number): boolean {
        return minA <= maxB && maxA >= minB;
    };

    public isCollidingWith(other: Collider): boolean {
        if (other instanceof BoxCollider) {
            const thisBounds = this.getTransformedBounds();
            const otherBounds = other.getTransformedBounds();
    
            const isColliding =
                this.isAxisOverlapping(thisBounds.min.x, thisBounds.max.x, otherBounds.min.x, otherBounds.max.x) &&
                this.isAxisOverlapping(thisBounds.min.y, thisBounds.max.y, otherBounds.min.y, otherBounds.max.y) &&
                this.isAxisOverlapping(thisBounds.min.z, thisBounds.max.z, otherBounds.min.z, otherBounds.max.z);
    
            return isColliding;
        }
    
        return false;
    }
    
    public getTransformedBounds(): { min: Vector3; max: Vector3 } {
        const halfSize = this.size.multiplyScalar(0.5).multiply(this.transform.scale);
        const center = this.transform.position.add(this.center);
    
        const rotation = this.transform.rotation;
        const vertices = [
            [-halfSize.x, -halfSize.y, -halfSize.z],
            [halfSize.x, -halfSize.y, -halfSize.z],
            [-halfSize.x, halfSize.y, -halfSize.z],
            [halfSize.x, halfSize.y, -halfSize.z],
            [-halfSize.x, -halfSize.y, halfSize.z],
            [halfSize.x, -halfSize.y, halfSize.z],
            [-halfSize.x, halfSize.y, halfSize.z],
            [halfSize.x, halfSize.y, halfSize.z],
        ];
    
        const min = new Vector3(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        const max = new Vector3(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY);
    
        const rotatedVertex = new Vector3();
        for (const [x, y, z] of vertices) {
            rotatedVertex.set(x, y, z);
            Quaternion.multiplyVector3InPlace(rotation, rotatedVertex);
            rotatedVertex.addInPlace(center);
    
            min.x = Math.min(min.x, rotatedVertex.x);
            min.y = Math.min(min.y, rotatedVertex.y);
            min.z = Math.min(min.z, rotatedVertex.z);
    
            max.x = Math.max(max.x, rotatedVertex.x);
            max.y = Math.max(max.y, rotatedVertex.y);
            max.z = Math.max(max.z, rotatedVertex.z);
        }
    
        return { min, max };
    }
    
    public onDrawGizmos(): void {
        // const worldCenter = this.transform.position.add(this.center);
        // Gizmos.color = this.color;
        // Gizmos.drawCube(worldCenter, this.size, this.transform.rotation, RenderMode.LINE_STRIP);
    }

    private previousCollisions: Set<Collider> = new Set();

    // public fixedUpdate(): void {
    //     const gameObjects = SceneManager.getAllGameObjects();
        
    //     for (const gameObject of gameObjects) {
    //         if (gameObject === this.gameObject || !gameObject.activeSelf) continue;
    
    //         const boxColliders = gameObject.getAllComponentsByType<BoxCollider>("BoxCollider");
    //         if (!boxColliders || boxColliders.length < 1) continue;
    
    //         for (const collider of boxColliders) {
    //             const collisionResult = this.isCollidingWith(collider);
    //             const wasColliding = this.previousCollisions.has(collider);
                
    //             if (collisionResult) {
    //                 if (!wasColliding) {
    //                     this.previousCollisions.add(collider);
    //                     this.invokeCollision(collider, Vector3.ZERO, CollisionEvent.ENTER);
    //                 } else {
    //                     this.invokeCollision(collider, Vector3.ZERO, CollisionEvent.STAY);
    //                 }
    //             } else {
    //                 if (wasColliding) {
    //                     this.previousCollisions.delete(collider);
    //                     this.invokeCollision(collider, undefined, CollisionEvent.EXIT);
    //                 }
    //             }
    //         }
    //     }
    // }
    
    private invokeCollision(collider: Collider, point: Vector3 | undefined, type: CollisionEvent): void {
        const collisionData = new CollisionData(this.gameObject, collider.gameObject, point);
        const components = this.gameObject.getAllComponents();
        if (!components) return;
        components.forEach(script => {
            switch (type) {
                case CollisionEvent.ENTER:
                    script.onCollisionEnter(collisionData);
                    break;
                case CollisionEvent.STAY:
                    script.onCollisionStay(collisionData);
                    break;
                case CollisionEvent.EXIT:
                    script.onCollisionExit(collisionData);
                    break;
            }
        });
    }
}