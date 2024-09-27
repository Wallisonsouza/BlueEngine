// import Mesh from "../Engine/graphycs/Mesh";
// import Renderer from "./Renderer";
// import Transform from "./Transform";
// import Camera from "./Camera";
// import { AttributesLocation, UniformsLocation} from "../Shader/Shader";
// import Material3D from "../Engine2D/Material/Material3D";
// import PointLight from "../Engine2D/Components/Light";
// import GameObject from "../Engine/components/GameObject";

// export default class MeshRenderer extends Renderer {
//     material: Material3D | null = null;
//     mesh: Mesh | null = null;
//     private light: PointLight;

//     constructor(){
//         super("MeshRenderer");
//         this.light = new PointLight();
//         const gameObject = new GameObject("");
//         this.light.setGameObject(gameObject);
//         this.light.intensity = 1;
//         gameObject.transform.position.z = 2;
//     }

    
//     public render(gl2: WebGL2RenderingContext, transform: Transform, camera: Camera): void {

//         if ( !this.material || !this.material.shader || !this.mesh || !this.mesh.indices || !this.mesh.vertexBuffer || !this.mesh.indexBuffer) return;
//         const shader = this.material.shader;
//         shader.use();
    
//         gl2.bindBuffer(gl2.ARRAY_BUFFER, this.mesh.vertexBuffer);
//         gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);

//         shader.enableAttribute3f(gl2, AttributesLocation.VERTEX_POSITION);
//         gl2.bindBuffer(gl2.ARRAY_BUFFER, this.mesh.normalBuffer);
//         shader.enableAttribute3f(gl2, AttributesLocation.VERTEX_NORMAL);

//         // Atualizar matrizes
//         shader.setUniformMatrix4fv(UniformsLocation.MODEL_MATRIX, transform.modelMatrix);
//         shader.setUniformMatrix4fv(UniformsLocation.VIEW_MATRIX, camera.viewMatrix);
//         shader.setUniformMatrix4fv(UniformsLocation.PROJECTION_MATRIX, camera.projectionMatrix);
        
//         gl2.bindBuffer(gl2.ARRAY_BUFFER, this.mesh.uvBuffer);
//         shader.enableAttribute2f(gl2, "TEXTURE_COORD");


//         if (this.material.albedo) {
//             shader.setUniform1i("ENABLE_ALBEDO", 1);
//             shader.setSample2d("MATERIAL_ALBEDO", this.material.albedo, 0);
            
//             shader.setUniform1i("MATERIAL_ALBEDO", 0); 
//         } else {
//             shader.setUniform1i("ENABLE_ALBEDO", 0);
//         }
        
//         if (this.material.normalMap) {
//             shader.setUniform1i("ENABLE_NORMAL_MAP", 1);
//             shader.setSample2d("MATERIAL_NORMAL_MAP", this.material.normalMap, 1);
//         } else {
//             shader.setUniform1i("ENABLE_NORMAL_MAP", 0);
//         }

//         // Atualizar luz e materiais

//         shader.setUniform3fv("CAMERA_DIRECTION", camera.transform.position);
//         shader.setUniform3fv("LIGHT_POSITION", this.light.transform.position);
//         shader.setUniform1f("MATERIAL_ROUGHNESS", this.material.roughness);
//         shader.setUniform1f("MATERIAL_METALLIC", this.material.metalic);
        
//         gl2.enable(gl2.DEPTH_TEST);
//         gl2.depthFunc(gl2.LEQUAL); 
//         gl2.drawElements(gl2.TRIANGLES, this.mesh.indices.length, gl2.UNSIGNED_SHORT, 0);
//     }
// }

import Mesh from "../Engine/graphycs/Mesh";
import Renderer from "./Renderer";
import Transform from "./Transform";
import Camera from "./Camera";
import { AttributesLocation, UniformsLocation} from "../Shader/Shader";
import Material3D from "../Engine2D/Material/Material3D";
import PointLight from "../Engine2D/Components/Light";
import GameObject from "../Engine/components/GameObject";

export default class MeshRenderer extends Renderer {
    material: Material3D | null = null;
    mesh: Mesh | null = null;
    private light: PointLight;

    constructor(){
        super("MeshRenderer");
        this.light = new PointLight();
        const gameObject = new GameObject("");
        this.light.setGameObject(gameObject);
        this.light.intensity = 1;
        gameObject.transform.position.z = 2;
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
        
        gl2.bindBuffer(gl2.ARRAY_BUFFER, this.mesh.viewBuffer);
        const location = shader.getAttributeLocation('VIEW_ATTRIBUTE');
        const size = 4;  // 4 floats por coluna
        const type = gl2.FLOAT;
        const normalize = false;
        const stride = 16 * Float32Array.BYTES_PER_ELEMENT; 
        const offset = 0;

        // Atualiza o buffer de dados com a matriz de visão da câmera
        gl2.bufferSubData(gl2.ARRAY_BUFFER, 0, transform.modelMatrix.multyply(camera.viewMatrix.multyply(camera.projectionMatrix)).getData());

        // Configura os atributos de vértice para a matriz 4x4
        for (let i = 0; i < 4; i++) {
        gl2.enableVertexAttribArray(location + i);
        gl2.vertexAttribPointer(
            location + i,         // Localização do atributo
            size,                 // Número de componentes por coluna (4 floats)
            type,                 // Tipo de dado (float)
            normalize,            // Não normalizar os dados
            stride,               // Tamanho do passo entre cada entrada
            offset + i * 4 * Float32Array.BYTES_PER_ELEMENT // Deslocamento para cada coluna
        );
        gl2.vertexAttribDivisor(location + i, 1);  // Usar divisor para instanced rendering
        }



        // Atualizar matrizes
        shader.setUniformMatrix4fv(UniformsLocation.MODEL_MATRIX, transform.modelMatrix);
        // shader.setUniformMatrix4fv(UniformsLocation.VIEW_MATRIX, );
        shader.setUniformMatrix4fv(UniformsLocation.PROJECTION_MATRIX, camera.projectionMatrix);
        
        gl2.bindBuffer(gl2.ARRAY_BUFFER, this.mesh.uvBuffer);
        shader.enableAttribute2f(gl2, "TEXTURE_COORD");


        if (this.material.albedo) {
            shader.setUniform1i("ENABLE_ALBEDO", 1);
            shader.setSample2d("MATERIAL_ALBEDO", this.material.albedo, 0);
            
            shader.setUniform1i("MATERIAL_ALBEDO", 0); 
        } else {
            shader.setUniform1i("ENABLE_ALBEDO", 0);
        }
        
        if (this.material.normalMap) {
            shader.setUniform1i("ENABLE_NORMAL_MAP", 1);
            shader.setSample2d("MATERIAL_NORMAL_MAP", this.material.normalMap, 1);
        } else {
            shader.setUniform1i("ENABLE_NORMAL_MAP", 0);
        }

        // Atualizar luz e materiais

        shader.setUniform3fv("CAMERA_DIRECTION", camera.transform.position);
        shader.setUniform3fv("LIGHT_POSITION", this.light.transform.position);
        shader.setUniform1f("MATERIAL_ROUGHNESS", this.material.roughness);
        shader.setUniform1f("MATERIAL_METALLIC", this.material.metalic);
        
        gl2.enable(gl2.DEPTH_TEST);
        gl2.depthFunc(gl2.LEQUAL); 
        gl2.drawElements(gl2.TRIANGLES, this.mesh.indices.length, gl2.UNSIGNED_SHORT, 0);
    }
}