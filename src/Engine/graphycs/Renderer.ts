import Camera from "../../Inplementations/Camera";
import Component from "../components/Component";

import Transform from "./Transform";

export default class Renderer extends Component {
    public render(gl: WebGL2RenderingContext, transform: Transform, camera: Camera) {};
    
    
}
