import WorldOptions from "../../../../engine/WorldOptions";
import BufferManager from "../../managers/BufferManager";
import Camera from "../../components/Camera";
import MeshFilter from "../../components/MeshFilter";
import Renderer from "../../components/Renderer";
import { RenderMode } from "../../enum/RenderMode";

export default class MeshRenderer extends Renderer {

    constructor() {
        super("MeshRenderer");
    }

    public render(gl: WebGL2RenderingContext, camera: Camera): void {

        const meshFilter = this.gameObject.getComponentByType<MeshFilter>("MeshFilter");

        if (!meshFilter) {
            console.warn("Mesh ou propriedades essenciais não encontradas. Verifique se a malha e o material estão definidos.");
            return;
            
        };

        const mesh = meshFilter.mesh;
        if (!mesh) {
            console.warn("Mesh ou propriedades essenciais não encontradas. Verifique se a malha e o material estão definidos.");
            return;
        }

        const material = this.material;

        if(!material) {
            console.warn("Mesh ou propriedades essenciais não encontradas. Verifique se a malha e o material estão definidos.");
            return;
        }
        
        const shader = material.shader;
        if (!shader) {
            console.warn("Mesh ou propriedades essenciais não encontradas. Verifique se a malha e o material estão definidos.");
            return;
        };

       
        let meshBuffer;
       
        meshBuffer =  BufferManager.getBufferArrayObject(mesh.id.value);

        if(!meshBuffer) {
            console.warn("Mesh ou propriedades essenciais não encontradas. Verifique se a malha e o material estão definidos.");
            return;
        }

        if(WorldOptions.renderMode === RenderMode.LINES){
            meshBuffer = BufferManager.getBufferArrayObject(mesh.id.value + 10000);
        }
     
        const modelMatrix = this.transform.modelMatrix;
        shader.setMat4("u_modelMatrix", modelMatrix);

        gl.bindVertexArray(meshBuffer);
        gl.drawElements(WorldOptions.renderMode, mesh.triangles.length, mesh.indexDataType, 0);
        gl.bindVertexArray(null);
       
    }
}
