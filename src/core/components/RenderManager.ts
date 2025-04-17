import Camera from "./Camera";
import Renderer from "./Renderer";
import Material from "../graphics/material/Material";
import LifeCycleEvents from "./CallbackManager";
import GameObject from "./GameObject";

export default class RendererManager {

 
    private static opaqueObjects: Map<Material, Renderer[]> = new Map();
    private static transparentObjects: Map<Material, Renderer[]> = new Map();

    // private static renderers: Renderer[] = [];
    // // essa merda pode dar erro corrija essa bosta depois 
    // public static addRenderer(render: Renderer) {
    //     if(!RendererManager.renderers.includes(render)) {
    //         RendererManager.renderers.push(render);
    //     }
    // }

    public static collectRenderers(gameObjects: GameObject[]): void {
        
        this.opaqueObjects.clear();
        this.transparentObjects.clear();

        for (const gameObject of gameObjects) {

            const renderers = gameObject.getComponentByGroup<Renderer>("Renderer");
            if(!renderers) continue;

            for(const renderer of renderers) {
                if(!renderer) {continue}
                if (!renderer.material) continue;
    
                const targetMap = renderer.material.isTransparent
                    ? this.transparentObjects
                    : this.opaqueObjects;
    
                if (!targetMap.has(renderer.material)) {
                    targetMap.set(renderer.material, []);
                }
                targetMap.get(renderer.material)?.push(renderer);
            }
        }
           
    }

    private static renderOpaqueObjects(gl: WebGL2RenderingContext, camera: Camera): void {
        for (const [material, renderers] of this.opaqueObjects) {
            
            material.update();
            material.apply();
            for (const renderer of renderers) {
                renderer.render(gl, camera);
            }
        }
    }

    private static renderTransparentObjects(gl: WebGL2RenderingContext, camera: Camera): void {
        for (const [material, renderers] of this.transparentObjects) {
            renderers.sort((a, b) => {
                const distA = camera.transform.position.distanceTo(a.transform.position);
                const distB = camera.transform.position.distanceTo(b.transform.position);
                return distB - distA;
            });

            material.update();
            material.apply();
            for (const renderer of renderers) {
                renderer.render(gl, camera);
            }
        }
    }

    public static renderObjects(gl: WebGL2RenderingContext, camera: Camera): void {
        // Opacos
        gl.enable(gl.DEPTH_TEST);
        gl.depthMask(true);
        gl.disable(gl.BLEND);
        this.renderOpaqueObjects(gl, camera);

        // Transparentes
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        // gl.depthMask(false);
        this.renderTransparentObjects(gl, camera);

        gl.depthMask(true);
        gl.disable(gl.BLEND);
    }
}

LifeCycleEvents.on("render", 
    function(gl: WebGL2RenderingContext, camera: Camera) {
        RendererManager.renderObjects(gl, camera);
    }
);