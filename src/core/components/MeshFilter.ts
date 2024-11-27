import Mesh from "../graphics/mesh/Mesh";
import { BoundingBox } from "../managers/RendererManager";
import Component from "./Component";
import Vector3 from "../math/Vector3";

export default class MeshFilter extends Component {
    
    public mesh: Mesh | null = null;

    constructor(mesh: Mesh | null = null){
        super("MeshFilter");
        this.mesh = mesh;
    }
    
    public getBoundingBox(): BoundingBox | null {
        if (!this.mesh || !this.mesh.vertices || this.mesh.vertices.length === 0) {
            return null;
        }

        let min = new Vector3(Infinity, Infinity, Infinity);
        let max = new Vector3(-Infinity, -Infinity, -Infinity);

        for (let i = 0; i < this.mesh.vertices.length; i += 3) {
            const x = this.mesh.vertices[i];
            const y = this.mesh.vertices[i + 1];
            const z = this.mesh.vertices[i + 2];

            if (x < min.x) min.x = x;
            if (y < min.y) min.y = y;
            if (z < min.z) min.z = z;

            if (x > max.x) max.x = x;
            if (y > max.y) max.y = y;
            if (z > max.z) max.z = z;
        }

        return new BoundingBox(min, max);
    }
}