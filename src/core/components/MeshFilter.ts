import Mesh from "../graphics/mesh/Mesh";
import Component from "./Component";
import Vector3 from "../math/Vector3";
import Bounds from "./collision/Bounds"; 

export default class MeshFilter extends Component {
    public mesh: Mesh | null = null;

    constructor(mesh: Mesh | null = null) {
        super("MeshFilter", "MeshFilter");
        this.mesh = mesh;
    }

    public get bounds() {
   
        return this.calculateBounds();
    }

    public calculateBounds() {
        if (!this.mesh || !this.mesh.vertices) {
            return null; 
        }
    
        let min = new Vector3(Infinity, Infinity, Infinity);
        let max = new Vector3(-Infinity, -Infinity, -Infinity);
    
        for (let i = 0; i < this.mesh.vertices.length; i++) {
            const vertex = this.mesh.vertices[i];
    
            min.x = Math.min(min.x, vertex.x);
            min.y = Math.min(min.y, vertex.y);
            min.z = Math.min(min.z, vertex.z);
    
            max.x = Math.max(max.x, vertex.x);
            max.y = Math.max(max.y, vertex.y);
            max.z = Math.max(max.z, vertex.z);
        }
    
        return new Bounds(min.add(max).scale(0.5), max.subtract(min));
    }
    
}
