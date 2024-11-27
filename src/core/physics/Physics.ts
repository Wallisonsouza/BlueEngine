import Collider from "../components/Collider";
import RayCast from "./RayCast";
import Camera from "../components/Camera";
import MeshFilter from "../components/MeshFilter";
import Vector3 from "../math/Vector3";
import Ray from "./Ray";
import RayCastData from "./RayCastData";
import GameObject from "../components/GameObject";


export class Physics {
    
    public static rayCast(origin: Vector3, direction: Vector3, maxDistance: number): RayCastData {

        const ray = new Ray(origin, direction);
        const gameObjects = GameObject.getAllGameObjects();
        // let closestData: RayCastData | null = null;
    
        for (let i = 0; i < gameObjects.length; i++) {
            const element = gameObjects[i];
            const colliders = element.getComponents(Collider);
    
            for (let j = 0; j < colliders.count; j++) {
                const collider = colliders.get(j);
                const collisionPoint = collider?.raycast(ray, maxDistance);
    
                if (collisionPoint) {
                    const distance = origin.subtract(collisionPoint).magnitude();
    
                    // // Verifica se a colisão está dentro do maxDistance
                    // if (distance <= maxDistance && (!closestData || distance < closestData.distance)) {
                    //     closestData = new RayCastData(true, collisionPoint, distance, element);
                    // }

                    return new RayCastData(true, collisionPoint, distance, element);
                }
            }
        }
    
        return new RayCastData(false, null, 0, null);
    }

    public static meshCast(ray: Ray) {
        const gameObjects = GameObject.getAllGameObjects();
        
        // Obter a posição da câmera (assumindo que existe um método para isso)
        const cameraPosition = Camera.mainCamera.transform.position;
    
        // Ordenar os objetos pela distância da câmera
        const sortedGameObjects = gameObjects.sort((a, b) => {
            const distA = a.transform.position.subtract(cameraPosition).magnitude();
            const distB = b.transform.position.subtract(cameraPosition).magnitude();
            return distA - distB;
        });
    
        for (let i = 0; i < sortedGameObjects.length; i++) {
            const element = sortedGameObjects[i];
            const meshFilters = element.getComponents(MeshFilter);
    
            for (let j = 0; j < meshFilters.count; j++) {
                const meshFilter = meshFilters.get(j);
                if (!meshFilter || !meshFilter.mesh) continue;
    
                const collisionPoint = RayCast.meshcast(ray, meshFilter.mesh, element.transform);
    
                if (collisionPoint) {
                    return new RayCastData(true, collisionPoint, 0, element); // Retorna a primeira colisão encontrada
                }
            }
        }
    
        return new RayCastData(null, null, null, null); // Retorna a primeira colisão encontrada
    }
}


