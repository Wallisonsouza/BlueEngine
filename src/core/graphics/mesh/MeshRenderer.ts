import WorldOptions from "../../../../engine/WorldOptions";
import BufferManager from "../../managers/BufferManager";
import Camera from "../../components/Camera";
import MeshFilter from "../../components/MeshFilter";
import Renderer from "../../components/Renderer";
import Shadow from "../../Shadow";

export default class MeshRenderer extends Renderer {
    constructor() {
        super("MeshRenderer");
    }

    public render(gl: WebGL2RenderingContext, camera: Camera): void {
        const meshFilter = this.gameObject.getComponentByType<MeshFilter>("MeshFilter");
        const material = this.material;

        if (!meshFilter || !meshFilter.mesh || !material || !material.shader) {
            console.warn(
                "MeshRenderer: Malha ou material ausente. Verifique se 'MeshFilter', 'mesh', 'material' e 'shader' estão definidos."
            );
            return;
        }

        const mesh = meshFilter.mesh;
        const shader = material.shader;
        const vbo = BufferManager.getVBO(mesh.id.value);

        if (!vbo) {
            console.warn(`MeshRenderer: VBO não encontrado para mesh ID '${mesh.id.value}'.`);
            return;
        }

        const modelMatrix = this.transform.modelMatrix;
        const lightMatrix = Shadow.getLightMatrix();

        shader.setMat4("u_modelMatrix", modelMatrix);
        shader.setMat4("u_lightSpaceMatrix", lightMatrix);

        gl.bindVertexArray(vbo);
        gl.drawElements(WorldOptions.renderMode, mesh.triangles.length, mesh.indexDataType, 0);
        gl.bindVertexArray(null);
    }
}
