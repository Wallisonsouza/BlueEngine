import Mesh from "./Mesh";
import Renderer from "../../components/Renderer";
import Transform from "../../components/Transform";
import Camera from "../../components/Camera";
import { AttributesLocation, UniformsLocation} from "../../Shader/Shader";
import Material3D from "../../Engine2D/Material/Material3D";
import PointLight from "../../Engine2D/Components/Light";
import GameObject from "../components/GameObject";

export default class MeshRenderer extends Renderer {
    material: Material3D | null = null;
    mesh: Mesh | null = null;
    private light: PointLight;

    constructor(){
        super("MeshRenderer");
        this.light = new PointLight();
        const gameObject = new GameObject("");
        this.light.setGameObject(gameObject);
        this.light.intensity = 2;
        gameObject.transform.position.z = 5;
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

        // Atualizar matrizes
        shader.setUniformMatrix4fv(UniformsLocation.MODEL_MATRIX, transform.modelMatrix);
        shader.setUniform3fv("CAMERA_DIRECTION", camera.transform.position);
        shader.setUniformMatrix4fv(UniformsLocation.VIEW_MATRIX, camera.viewMatrix);
        shader.setUniformMatrix4fv(UniformsLocation.PROJECTION_MATRIX, camera.projectionMatrix);

        if(this.material.albedo) {
            shader.setUniform1i("isTexture", 1);
            gl2.bindBuffer(gl2.ARRAY_BUFFER, this.mesh.uvBuffer);
            shader.enableAttribute2f(gl2, "TEXTURE_COORD");
            shader.setSample2d("TEXTURE_ALBEDO", this.material.albedo);
        } else {
            shader.setUniform1i("isTexture", 0);
        }

        // Atualizar luz e materiais
        shader.setUniform3fv("LIGHT_POSITION", this.light.transform.position);
        shader.setUniform1f("LIGHT_RANGE", this.light.range);
        shader.setUniform1f("LIGHT_INTENSITY", this.light.intensity);
        shader.setUniform1f(UniformsLocation.MATERIAL_SPECULAR, 1.0);
        shader.setUniform3fv(UniformsLocation.OBJECT_COLOR, this.material.color.rgbArray());
        
        gl2.enable(gl2.DEPTH_TEST);
        gl2.depthFunc(gl2.LEQUAL); 
        gl2.enable(gl2.CULL_FACE); 
        gl2.cullFace(gl2.BACK);  

        gl2.drawElements(gl2.TRIANGLES, this.mesh.indices.length, gl2.UNSIGNED_SHORT, 0);

        this.light.drawGizmos();
    }
}