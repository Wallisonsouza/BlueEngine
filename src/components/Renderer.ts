import Camera from "./Camera";
import Component from "./Component";
import Transform from "./Transform";

export default class Renderer extends Component {
    public render(gl: WebGL2RenderingContext, transform: Transform, camera: Camera) {};
    private isVisible(camera: Camera, transform: Transform): boolean {
        // Implementação de lógica de culling (checar se o objeto está dentro do frustum da câmera)
        return true;
    }
}
