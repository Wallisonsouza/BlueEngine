import Renderer from "../../components/Renderer";
import Camera from "../../components/Camera";
import { AttributesLocation, Shader, UniformsLocation} from "../shaders/Shader";
import Material3D from "../material/Material3D";
import { BufferManager } from "../../managers/BufferManager";
import Matrix4x4 from "../../math/Matrix4x4";
import Light from "../../components/Light";
import MeshFilter from "../../components/MeshFilter";
import GameObject from "../../components/GameObject";

export default class MeshRenderer extends Renderer {
    material: Material3D | null = null;

    constructor(){
        super("MeshRenderer");
    }

    private setTextureUniform(shader: Shader, texture: WebGLTexture | null, uniformName: string, controlerName: string,  textureUnit: number): void {
        if (texture) {
            shader.setUniform1i(`${controlerName}`, 1);
            shader.setSample2d(`${uniformName}`, texture, textureUnit);
        } else {
            shader.setUniform1i(`${controlerName}`, 0);
        }
    }
    
    public render(gl2: WebGL2RenderingContext, gameObject: GameObject, camera: Camera): void {
        
  
        const meshFilter = this.gameObject.getComponent(MeshFilter);

        if(!meshFilter || !meshFilter.mesh || !meshFilter.mesh.triangles) {
            return
        }

        if(!this.material || !this.material.shader) {
            throw new Error("Erro, material nao encontrado");
        }

        const shader = this.material.shader;
        shader.use();

        const buffer = BufferManager.getBuffer(meshFilter.mesh.id);
        if(!buffer) return;

        gl2.bindBuffer(gl2.ARRAY_BUFFER, buffer.vertexBuffer);
        gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, buffer.indexBuffer);
        shader.enableAttribute3f(gl2, AttributesLocation.VERTEX_POSITION);

        if(buffer.normalBuffer){
            gl2.bindBuffer(gl2.ARRAY_BUFFER, buffer.normalBuffer);
            shader.enableAttribute3f(gl2, AttributesLocation.VERTEX_NORMAL);
        }

        if(buffer.uvBuffer){
            gl2.bindBuffer(gl2.ARRAY_BUFFER, buffer.uvBuffer);
            shader.enableAttribute2f(gl2, "TEXTURE_COORD");
        }

        if(buffer.tangentBuffer) {
            gl2.bindBuffer(gl2.ARRAY_BUFFER, buffer.tangentBuffer);
            shader.enableAttribute3f(gl2,"a_tangent");
        }

        shader.setUniformMatrix4fv(UniformsLocation.MODEL_MATRIX, gameObject.transform.modelMatrix);
        shader.setUniformMatrix4fv(UniformsLocation.VIEW_MATRIX, camera.viewMatrix);
        shader.setUniformMatrix4fv(UniformsLocation.PROJECTION_MATRIX, camera.projectionMatrix);
        shader.setUniformMatrix4fv("u_inverseTransposeModel", Matrix4x4.transpose(gameObject.transform.modelMatrix.inverse()));


            
        shader.setUniform3fv("u_camera_position", camera.transform.position);
       
        const maxLights = 10;
        
        const lights = Light.getAllLights();
   
        for (let i = 0; i < Math.min(lights.length, maxLights); i++) {
            const light = lights[i];
            if (!light) { return };
            const prefix = `u_lights[${i}]`;
            shader.setUniform3fv(`${prefix}.position`, light.transform.position);
            shader.setUniform3fv(`${prefix}.color`, light.color.rgb);
            shader.setUniform1f(`${prefix}.intensity`, light.intensity);
            shader.setUniform1f(`${prefix}.radius`, light.radius);
            shader.setUniform3fv(`${prefix}.direction`, light.transform.forward);
        }

        const materialPrefix = "u_material";
        shader.setUniform3fv(`${materialPrefix}.baseColor`, this.material.color.rgb);
        shader.setUniform1f(`${materialPrefix}.metallic`, this.material.metalic);
        shader.setUniform1f(`${materialPrefix}.roughness`, this.material.roughness);
        shader.setUniform1f(`${materialPrefix}.ior`, this.material.ior);
        shader.setUniform1f(`${materialPrefix}.alpha`, this.material.alpha);
 
        const indexType = meshFilter.mesh.triangles instanceof Uint32Array ? gl2.UNSIGNED_INT : gl2.UNSIGNED_SHORT;
        gl2.enable(gl2.DEPTH_TEST);
        gl2.enable(gl2.BLEND);
        gl2.blendFunc(gl2.SRC_ALPHA, gl2.ONE_MINUS_SRC_ALPHA);



        const texturePrefix = "u_texture";
        this.setTextureUniform(
            shader, 
            this.material.baseColorTexture, 
            `${texturePrefix}.baseColor`, 
            `${texturePrefix}.hasBaseColor`, 
            0
        );

        this.setTextureUniform(
            shader, 
            this.material.metallicRoughnessTexture, 
            `${texturePrefix}.metallicRoughness`, 
            `${texturePrefix}.hasMetallicRoughness`, 
            1
        );

        this.setTextureUniform(
            shader, 
            this.material.environmentTexture, 
            `${texturePrefix}.environment`, 
            `${texturePrefix}.hasEnvironment`, 
            2
        );

        this.setTextureUniform(
            shader, 
            this.material.normalTexture, 
            `${texturePrefix}.normal`, 
            `${texturePrefix}.hasNormal`, 
           3
        );

        gl2.drawElements(gl2.TRIANGLES, meshFilter.mesh.triangles.length, indexType, 0);
    }
}

