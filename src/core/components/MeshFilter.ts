import Mesh from "../graphics/mesh/Mesh";
import Component from "./Component";

export default class MeshFilter extends Component {
    public mesh: Mesh | null = null;

    constructor(mesh: Mesh | null = null) {
        super("MeshFilter", "MeshFilter");
        this.mesh = mesh;
    }
}
