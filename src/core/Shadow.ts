import WorldOptions from "../../engine/WorldOptions";
import MeshFilter from "./components/MeshFilter";
import Renderer from "./components/Renderer";
import { RenderMode } from "./enum/RenderMode";
import BufferManager from "./managers/BufferManager";
import ShaderManager from "./managers/ShaderManager";
import Matrix4x4 from "./math/Matrix4x4";
import Vector3 from "./math/Vector3";

export default class Shadow {


    public static render(gl: WebGL2RenderingContext, renderers: Renderer[]) {

        const shader = ShaderManager.getShader("shadow");
        if (!shader) return;

        shader.use();

        for (const renderer of renderers) {

            const meshFilter = renderer.gameObject.getComponentByType<MeshFilter>("MeshFilter");
            if (!meshFilter) {
                console.warn(`MeshFilter não encontrado para o GameObject ${renderer.gameObject.name}`);
                continue;
            }
            
            const mesh = meshFilter.mesh;
            if (!mesh) {
                console.warn(`Malha não encontrada para o GameObject ${renderer.gameObject.name}`);
                continue;
            }

            const vbo = BufferManager.getVBO(mesh.id.value);
            if (!vbo) {
                console.warn(`VBO não encontrado para o mesh com ID ${mesh.id.value}`);
                continue;
            }

            const transform = renderer.gameObject.transform;
            const modelMatrix = transform.modelMatrix;
            const lightMatrix = Shadow.lightMatrix;
            
            shader.setMat4("modelMatrix", modelMatrix);
            shader.setMat4("lightSpaceMatrix", lightMatrix);

            gl.bindVertexArray(vbo);
            gl.drawElements(RenderMode.TRIANGLES, mesh.triangles.length, mesh.indexDataType, 0);
            gl.bindVertexArray(null);
        }

        console.log(`Renderizando sombras (${renderers.length} objetos)`);
    }

    public static get lightMatrix(): Matrix4x4 {
        const lightDirection = WorldOptions.sunLight.transform.fwd.normalized;
    
        let up = Vector3.up;
        if (Math.abs(Vector3.dot(lightDirection, up)) >= 1.0) {
            up = Vector3.right; 
        }
    
        const sceneSize = 20.0;
        const lightPosition = Vector3.zero.subtract(lightDirection.multiplyScalar(sceneSize / 2));
        const lightView = Matrix4x4.createLookAt(lightPosition, Vector3.zero, up);
       
        const range = sceneSize;
   
        const lightProjection = Matrix4x4.createOrthographic(
            -range / 2, range / 2, 
            -range / 2, range / 2, 
            -range, range * 2
        );
    
        return Matrix4x4.multiply(lightProjection, lightView);
    }
    
    public static getLightMatrix(): Matrix4x4 {
        const lightDirection = WorldOptions.sunLight.transform.fwd.normalized;
    
        let up = Vector3.up;
        if (Math.abs(Vector3.dot(lightDirection, up)) >= 1.0) {
            up = Vector3.right; 
        }
    
        const sceneSize = 20.0;
        const lightPosition = Vector3.zero.subtract(lightDirection.multiplyScalar(sceneSize / 2));
        const lightView = Matrix4x4.createLookAt(lightPosition, Vector3.zero, up);
       
        const range = sceneSize;
   
        const lightProjection = Matrix4x4.createOrthographic(
            -range / 2, range / 2, 
            -range / 2, range / 2, 
            -range, range * 2
        );
    
        return Matrix4x4.multiply(lightProjection, lightView);
    }
    
}
