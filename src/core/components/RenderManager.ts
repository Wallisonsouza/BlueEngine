import Camera from "./Camera";
import Renderer from "./Renderer";
import Material from "../graphics/material/Material";
import RendererManager from "../managers/RendererManager";

export default class RendMang {

    private static opaqueObjects: Map<Material, Renderer[]> = new Map();
    private static transparentObjects: Map<Material, Renderer[]> = new Map();

    public static collectRenderers(): void {
        
        this.opaqueObjects.clear();
        this.transparentObjects.clear();

        const renderers = RendererManager.getAll();

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
