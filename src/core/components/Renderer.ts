import Camera from "./Camera";
import Component from "./Component";
import GameObject from "./GameObject";

export default class Renderer extends Component {
    public render(_gl: WebGL2RenderingContext, _gameObject: GameObject, _camera: Camera) {};
}