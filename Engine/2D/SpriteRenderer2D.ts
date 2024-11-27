// import Renderer from "./Renderer";
// import Transform from "./Transform";
// import Camera from "./Camera";
// import { Material2D } from "../Engine2D/Material/Material2D";
// import PointLight2D from "../Engine2D/Components/Light2D";
// import { Sprite2D } from "../Engine2D/Components/Sprite2D";

// export default class SpriteRenderer2D extends Renderer {

  
//     public sprite: Sprite2D | null = null;
//     public material: Material2D | null = null;
//     light: PointLight2D = new PointLight2D();

//     constructor(){
//         super("SpriteRenderer");
//     }

//     public render(gl: WebGL2RenderingContext, transform: Transform, camera: Camera): void {
//         this.renderScene(gl, transform, camera);
//     }
    
//     private renderScene(gl: WebGL2RenderingContext, transform: Transform, camera: Camera) {
      
//         if (!camera || !this.sprite || !this.material || !this.material.shader || !this.sprite.mesh.triangles) return;
    
//         this.material.shader.use();

//         const model = transform.modelMatrix;
//         const view = camera.viewMatrix;
//         const projection = camera.projectionMatrix;
    
//         this.material.shader.setUniformMatrix4fv("u_modelMatrix", model);
//         this.material.shader.setUniformMatrix4fv("u_viewMatrix", view);
//         this.material.shader.setUniformMatrix4fv("u_projectionMatrix", projection);
    
//         gl.bindBuffer(gl.ARRAY_BUFFER, this.sprite.mesh.vertexBuffer);
//         this.material.shader.enableAttribute3f(gl, "a_position");
    
//         gl.bindBuffer(gl.ARRAY_BUFFER, this.sprite.mesh.uvBuffer);
//         this.material.shader.enableAttribute2f(gl, "a_textureCoord");
   
//         if (this.material.texture && this.material.texture.data) {
//             gl.activeTexture(gl.TEXTURE0);
//             gl.bindTexture(gl.TEXTURE_2D, this.material.texture.data);
//             this.material.shader.setUniform1i("u_texture", 0);
//             this.material.shader.setUniform2f("u_resolution", this.material.texture.width, this.material.texture.height);
//             this.material.shader.setUniform1f("u_outlineThickness", transform.position.distanceTo(camera.transform.position));
//         } 
    
//         const [x, y, z, w] = this.material.color.toArray();
//         this.material.shader.setUniform4f("u_color", x, y, z, w);

//         //------------------------------luz
//         this.material.shader.setUniform4fv("u_lightColor", this.light.color.toArray());
//         this.material.shader.setUniform2fv("u_lightPosition",this.light.position);
//         this.material.shader.setUniform1f("u_lightRadius",this.light.radius);
//         this.material.shader.setUniform1f("u_lightIntensity",this.light.intensity);
        

//         gl.enable(gl.BLEND);
//         gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

//         gl.enable(gl.DEPTH_TEST);
//         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.sprite.mesh.indexBuffer);
        
//         gl.drawElements(gl.TRIANGLES, this.sprite.mesh.triangles.length, gl.UNSIGNED_SHORT, 0);

//         // this.light.drawGizmos();
//     }
// }

