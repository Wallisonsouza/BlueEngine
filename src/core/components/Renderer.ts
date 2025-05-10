import Material from "../graphics/material/Material";
import Camera from "./Camera";
import Component from "./Component";

export default abstract class Renderer extends Component {

    constructor(type: string) {
        super(type, "Renderer");
    }
    
    material: Material | null = null;
    public abstract render(gl: WebGL2RenderingContext, camera: Camera): void;
}

