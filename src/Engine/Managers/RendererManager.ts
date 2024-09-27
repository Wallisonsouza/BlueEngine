import Vector3 from "../../../engine_modules/vectors/Vector3";
import Camera from "../../components/Camera";
import Component from "../../components/Component";
import Renderer from "../../components/Renderer";
import { IRenderingApi } from "../../global";
import Mesh, { WebGL2Api } from "../graphycs/Mesh";
import ServiceLocator from "../graphycs/ServiceLocator";
import SceneManager from "./SceneManager";


export class BufferManager {
    
    public static updateBufferLocation(){
        const API = ServiceLocator.get<IRenderingApi>('RenderingApi');
    }

    public static createObjectBuffer(vertices: Vector3[], indices: number[]) {
        const API = ServiceLocator.get<IRenderingApi>('RenderingApi') as WebGL2Api;
        
        const gl2 = API.context;
      
        const vertexBuffer = gl2.createBuffer();
        gl2.bindBuffer(gl2.ARRAY_BUFFER, vertexBuffer);
        
        const vertexArray = Vector3.arrayToFloat32Array(vertices);
       
        gl2.bufferData(gl2.ARRAY_BUFFER, vertexArray, gl2.STATIC_DRAW);

        const indexBuffer = gl2.createBuffer();
        gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, indexBuffer);
        
        const indexArray = new Uint16Array(indices);
        
        gl2.bufferData(gl2.ELEMENT_ARRAY_BUFFER, indexArray, gl2.STATIC_DRAW);

        return {
            vertexBuffer,
            indexBuffer,
            vertexCount: vertexArray.length / 3,
            indexCount: indexArray.length
        };
    }
    
}

export default class RendererManager {

    public static start(){
        
        const gameEntities = SceneManager.getCurrentScene().getHierarchy().getGameObjects();
        const meshs: Mesh [] = [];
        let id = 0;
        
        gameEntities.forEach(g => { 
            const renderers = g.getComponents(Renderer);
            renderers.forEach(r => {
                if(!r.mesh) return;

                if((r.mesh.id !== id)) {
                    meshs.push(r.mesh);
                }
                id = r.mesh.id;
            });
        });

        const allVertices: Vector3[] = [];
        const allIndices: number[] = [];

        meshs.forEach(mesh => {
            if(!mesh.vertices || !mesh.indices) return;
            allVertices.push(...mesh.vertices);
            allIndices.push(...mesh.indices);
        })

        BufferManager.createObjectBuffer(allVertices, allIndices);
    }


        
    public static update(): void {
        const API = ServiceLocator.get<IRenderingApi>('RenderingApi');
        const camera = ServiceLocator.get<Camera>('ActiveCamera');

        if (!(API instanceof WebGL2Api)) {
            console.error("API de renderização não é uma instância de WebGL2Api.");
            return;
        }

        if (!camera) {
            console.error("Camera principal não disponível.");
            return;
        }

        const [r, g, b, a] = camera.clearColor.toArray();
        API.context.clearColor(r, g, b, a);
        API.context.clear(API.context.COLOR_BUFFER_BIT | API.context.DEPTH_BUFFER_BIT);
        API.context.viewport(0, 0, window.innerWidth, window.innerHeight);
        camera.aspectRatio = window.innerWidth / window.innerHeight;

      

        
    }

         
    // public static update(): void {
    //     const API = ServiceLocator.get<IRenderingApi>('RenderingApi');
    //     const camera = ServiceLocator.get<Camera>('ActiveCamera');

    //     if (!(API instanceof WebGL2Api)) {
    //         console.error("API de renderização não é uma instância de WebGL2Api.");
    //         return;
    //     }

    //     if (!camera) {
    //         console.error("Camera principal não disponível.");
    //         return;
    //     }

    //     const [r, g, b, a] = camera.clearColor.toArray();
    //     API.context.clearColor(r, g, b, a);
    //     API.context.clear(API.context.COLOR_BUFFER_BIT | API.context.DEPTH_BUFFER_BIT);
    //     API.context.viewport(0, 0, window.innerWidth, window.innerHeight);
    //     camera.aspectRatio = window.innerWidth / window.innerHeight;

      

        
    // }




















    
    public static drawGizmos(): void {
        const API = ServiceLocator.get<IRenderingApi>('RenderingApi');
        const camera = ServiceLocator.get<Camera>('ActiveCamera');

        if (!(API instanceof WebGL2Api)) {
            console.error("API de renderização não é uma instância de WebGL2Api.");
            return;
        }

        if (!camera) {
            console.error("Camera principal não disponível.");
            return;
        }

        const gameEntities = SceneManager.getCurrentScene().getHierarchy().getGameObjects();

        gameEntities.forEach(entity => {
            entity.getComponents(Component).forEach(component => {
                if (component.active) {
                    component.drawGizmos();
                }
            });
        });
    }
}
