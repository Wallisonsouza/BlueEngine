import Material from "../../Engine2D/Material/Material";
import Camera from "../../Inplementations/Camera";
import Component from "../components/Component";

import Transform from "./Transform";

export default class Renderer extends Component {
    public render(_gl: WebGL2RenderingContext, _transform: Transform, _camera: Camera) {};
}
