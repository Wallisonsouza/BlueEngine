import Mesh from "./Mesh";
import Renderer from "./Renderer";
import Transform from "./Transform";
import Camera from "../../Inplementations/Camera";
import { AttributesLocation as AttributesLocation, UniformsLocation as UniformsLocation, Shader } from "../../Shader/Shader";
import Material3D from "../../Engine2D/Material/Material3D";


export default class MeshRenderer extends Renderer {
    material: Material3D | null = null;
    mesh: Mesh | null = null;

    constructor(){
        super("MeshRenderer");
    }
    public render(gl2: WebGL2RenderingContext, transform: Transform, camera: Camera): void {

        if ( !this.material || !this.material.shader || !this.mesh || !this.mesh.indices || !this.mesh.vertexBuffer || !this.mesh.indexBuffer) return;
        const shader = this.material.shader;
        shader.use();
    
        gl2.bindBuffer(gl2.ARRAY_BUFFER, this.mesh.vertexBuffer);
        gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
        shader.enableAttribute3f(gl2, AttributesLocation.VERTEX_POSITION);
        gl2.bindBuffer(gl2.ARRAY_BUFFER, this.mesh.normalBuffer);
        shader.enableAttribute3f(gl2, AttributesLocation.VERTEX_NORMAL);

        gl2.bindBuffer(gl2.ARRAY_BUFFER, this.mesh.uvBuffer);
        shader.enableAttribute2f(gl2, "TEXTURE_COORD");

        // Atualizar matrizes
        shader.setUniformMatrix4fv(UniformsLocation.MODEL_MATRIX, transform.modelMatrix);
        shader.setUniform3fv(UniformsLocation.CAMERA_POSITION, camera.transform.position);
        shader.setUniform3fv("CAMERA_DIRECTION", camera.transform.forward);
        shader.setUniformMatrix4fv(UniformsLocation.VIEW_MATRIX, camera.viewMatrix);
        shader.setUniformMatrix4fv(UniformsLocation.PROJECTION_MATRIX, camera.projectionMatrix);

        if(this.material.albedo) {
            shader.setSample2d("TEXTURE_ALBEDO", this.material.albedo);
        }

        // // Atualizar luz e materiais
        // this.shader.setUniform3fv(UniformsLocation.LIGHT_POSITION, camera.transform.position);
        // this.shader.setUniform1f(UniformsLocation.SPECULAR, 1.0);
        shader.setUniform3fv(UniformsLocation.OBJECT_COLOR, this.material.color.rgbArray());
        
        gl2.enable(gl2.DEPTH_TEST);
        gl2.drawElements(gl2.TRIANGLES, this.mesh.indices.length, gl2.UNSIGNED_SHORT, 0);

        gl2.bindBuffer(gl2.ARRAY_BUFFER, null);
        gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, null);
        gl2.useProgram(null);
    }
}



// gl2.depthFunc(gl2.LEQUAL); 
// gl2.enable(gl2.CULL_FACE); 
// gl2.cullFace(gl2.BACK);  