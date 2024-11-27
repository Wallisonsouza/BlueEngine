import Ray from "../physics/Ray";
import Camera from "../components/Camera";
import Component from "../components/Component";
import Renderer from "../components/Renderer";
import Light from "../components/Light";
import { IRenderingApi } from "../../global";
import GameObject from "../components/GameObject";
import ServiceLocator from "../factory/ServiceLocator";
import { WebGL2Api } from "../graphics/mesh/WebGl2Api";
import Vector3 from "../math/Vector3";


export default class RendererManager {
    public static update(): void {
        const API = ServiceLocator.get<IRenderingApi>('RenderingApi');
        const camera = Camera. mainCamera;
    
        if (!(API instanceof WebGL2Api)) {
            console.error("API de renderização não é uma instância de WebGL2Api.");
            return;
        }
    
        if (!camera) {
            console.error("Câmera principal não disponível.");
            return;
        }
    
        const { width, height } = API.context.canvas;
        API.context.viewport(0, 0, width, height);
        camera.aspectRatio = width / height;
    
        const [r, g, b, a] = camera.clearColor.rgba;
        API.context.clearColor(r, g, b, a);
        API.context.clear(API.context.COLOR_BUFFER_BIT);

        const gameEntities = GameObject.getAllGameObjects();

        // Renderização dos componentes (fora do loop do raycast para melhorar a performance)
        for (let i = 0; i < gameEntities.length; i++) {
            const entity = gameEntities[i];

            // Verifica se o objeto está ativo
            if (!entity.activeSelf || !entity.activeInHierarchy) continue;
            this.process(entity);

            for (let x = 0; x < entity.transform.childCount; x++) {
               const children = entity.transform.childrens.get(x);

               if(!children) return;

               this.process(children.gameObject);
            }
        }
    }

    private static process(entity: GameObject) {
        const API = ServiceLocator.get<IRenderingApi>('RenderingApi');
        if (!(API instanceof WebGL2Api)) {
            console.error("API de renderização não é uma instância de WebGL2Api.");
            return;
        }
        const camera = Camera. mainCamera;
        // Renderiza os componentes da entidade
        entity.getComponents(Component).forEach(component => {
            if (!component.active) return;

            if(component instanceof Light) {
                component.drawGizmos();
                
            }
    
            if (component instanceof Renderer) {
                component.render(API.context, entity, camera);
            }
            
        }); 
    }
}



export class BoundingBox {
    public min: Vector3;
    public max: Vector3;

    constructor(min: Vector3, max: Vector3) {
        this.min = min;
        this.max = max;
    }
    
    public intersectRay(ray: Ray): boolean {
        let tMin = (this.min.x - ray.origin.x) / ray.direction.x;
        let tMax = (this.max.x - ray.origin.x) / ray.direction.x;

        if (ray.direction.x === 0) {
            tMin = -Infinity;
            tMax = Infinity;
        }

        if (tMin > tMax) [tMin, tMax] = [tMax, tMin];

        let tyMin = (this.min.y - ray.origin.y) / ray.direction.y;
        let tyMax = (this.max.y - ray.origin.y) / ray.direction.y;

        if (ray.direction.y === 0) {
            tyMin = -Infinity;
            tyMax = Infinity;
        }

        if (tyMin > tyMax) [tyMin, tyMax] = [tyMax, tyMin];

        if ((tMin > tyMax) || (tyMin > tMax)) return false;

        if (tyMin > tMin) tMin = tyMin;
        if (tyMax < tMax) tMax = tyMax;

        let tzMin = (this.min.z - ray.origin.z) / ray.direction.z;
        let tzMax = (this.max.z - ray.origin.z) / ray.direction.z;

        if (ray.direction.z === 0) {
            tzMin = -Infinity;
            tzMax = Infinity;
        }

        if (tzMin > tzMax) [tzMin, tzMax] = [tzMax, tzMin];

        return (tMin <= tzMax) && (tzMin <= tMax);
    }

    public intersectBoundingBox(other: BoundingBox): boolean {
        return (
            this.min.x <= other.max.x &&
            this.max.x >= other.min.x &&
            this.min.y <= other.max.y &&
            this.max.y >= other.min.y &&
            this.min.z <= other.max.z &&
            this.max.z >= other.min.z
        );
    }
}
