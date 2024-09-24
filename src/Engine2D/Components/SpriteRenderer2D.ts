import Renderer from "../../components/Renderer";
import Transform from "../../components/Transform";
import Camera from "../../components/Camera";
import { Material2D } from "../Material/Material2D";
import PointLight2D from "./Light2D";
import { Sprite2D } from "./Sprite2D";

export default class SpriteRenderer2D extends Renderer {

  
    public sprite: Sprite2D | null = null;
    public material: Material2D | null = null;
    light: PointLight2D = new PointLight2D();

    constructor(){
        super("SpriteRenderer");
    }

    public render(gl: WebGL2RenderingContext, transform: Transform, camera: Camera): void {
        this.renderScene(gl, transform, camera);
    }
    
    private renderScene(gl: WebGL2RenderingContext, transform: Transform, camera: Camera) {
      
        if (!camera || !this.sprite || !this.material || !this.material.shader || !this.sprite.mesh.indices) return;
    
        this.material.shader.use();

        const model = transform.modelMatrix;
        const view = camera.viewMatrix;
        const projection = camera.projectionMatrix;
    
        this.material.shader.setUniformMatrix4fv("u_modelMatrix", model);
        this.material.shader.setUniformMatrix4fv("u_viewMatrix", view);
        this.material.shader.setUniformMatrix4fv("u_projectionMatrix", projection);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, this.sprite.mesh.vertexBuffer);
        this.material.shader.enableAttribute3f(gl, "a_position");
    
        gl.bindBuffer(gl.ARRAY_BUFFER, this.sprite.mesh.uvBuffer);
        this.material.shader.enableAttribute2f(gl, "a_textureCoord");
   
        if (this.material.texture) {
            gl.activeTexture(gl.TEXTURE0);
            gl.bindTexture(gl.TEXTURE_2D, this.material.texture);
            this.material.shader.setUniform1i("u_texture", 0);
        } 
    
        const [x, y, z, w] = this.material.color.toArray();
        this.material.shader.setUniform4f("u_color", x, y, z, w);

        //------------------------------luz
        this.material.shader.setUniform4fv("u_lightColor", this.light.color.toArray());
        this.material.shader.setUniform2fv("u_lightPosition",this.light.position);
        this.material.shader.setUniform1f("u_lightRadius",this.light.radius);
        this.material.shader.setUniform1f("u_lightIntensity",this.light.intensity);
     

        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

        gl.enable(gl.DEPTH_TEST);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sprite.mesh.indexBuffer);
        
        gl.drawElements(gl.TRIANGLES, this.sprite.mesh.indices.length, gl.UNSIGNED_SHORT, 0);
    
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, null);

        gl.disable(gl.BLEND);
        // this.light.drawGizmos();
    }
}

