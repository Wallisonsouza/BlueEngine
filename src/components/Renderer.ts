import Material from "../Engine2D/Material/Material";
import Camera from "./Camera";
import Component from "./Component";

import Transform from "./Transform";

export default class Renderer extends Component {
    public render(_gl: WebGL2RenderingContext, _transform: Transform, _camera: Camera) {};
}
