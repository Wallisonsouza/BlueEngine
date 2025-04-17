import Collider from "../components/collision/Collider";
import RayCast from "./RayCast";
import Camera from "../components/Camera";
import MeshFilter from "../components/MeshFilter";
import Vector3 from "../math/Vector3";
import Ray from "./Ray";
import RayCastData from "./RayCastData";
import SceneManager from "../managers/SceneManager";


export class Physics {
    
    public static rayCast(origin: Vector3, direction: Vector3, maxDistance: number): RayCastData | null {
        const ray = new Ray(origin, direction);
        const gameObjects = SceneManager.getAllGameObjects();
        
        for (let i = 0; i < gameObjects.length; i++) {
            const element = gameObjects[i];
    
            // Verifica se o objeto deve ser ignorado
            if (element.tag === "ignoreRaycast") {
                continue; // Continua verificando outros objetos
            }
    
            const colliders = element.getComponentByGroup<Collider>("Collider");
            if (!colliders) continue; // Continua para o próximo gameObject se não houver colidires
    
            for (let j = 0; j < colliders.length; j++) {
                const collider = colliders[j];
    
                // Verifica se o raio colide com o colisor
                const collisionPoint = collider.raycast(ray);
    
                if (collisionPoint) {
                    const distance = origin.subtract(collisionPoint).magnitude();
    
                    // Verifica se a colisão está dentro do maxDistance
                    if (distance <= maxDistance) {
                        return new RayCastData(true, collisionPoint, distance, element); // Retorna dados de colisão
                    }
                }
            }
        }
    
        return null; // Nenhuma colisão encontrada
    }
    
    
    

    public static meshCast(ray: Ray) {
        const gameObjects = SceneManager.getAllGameObjects();
        
        // Obter a posição da câmera (assumindo que existe um método para isso)
        const cameraPosition = Camera.main.transform.position;
    
        // Ordenar os objetos pela distância da câmera
        const sortedGameObjects = gameObjects.sort((a, b) => {
            const distA = a.transform.position.subtract(cameraPosition).magnitude();
            const distB = b.transform.position.subtract(cameraPosition).magnitude();
            return distA - distB;
        });
    
        for (let i = 0; i < sortedGameObjects.length; i++) {
            const element = sortedGameObjects[i];
            const meshFilters = element.getAllComponentsByType<MeshFilter>("MeshFilter");
    
            for (let j = 0; j < meshFilters.length; j++) {
                const meshFilter = meshFilters[j];
                if (!meshFilter || !meshFilter.mesh) continue;
    
                const collisionPoint = RayCast.meshcast(ray, meshFilter.mesh, element.transform);
    
                if (collisionPoint) {
                    return new RayCastData(true, collisionPoint, 0, element); // Retorna a primeira colisão encontrada
                }
            }
        }
    
        return null; // Retorna a primeira colisão encontrada
    }
}


