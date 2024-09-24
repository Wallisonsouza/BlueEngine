import CameraController from "./Engine/CameraControler";
import MonoComportament from "./Engine/components/MonoComportament";
import Time from "./Engine/static/Time";
import Camera from "./components/Camera";

export default class SimpleEngine extends MonoComportament {

    cameraControle: CameraController = new CameraController();

    public start(): void {
        Camera.main.camera.farPlane = 2000;
    }

    public update(): void { 
        this.cameraControle.update(Camera.main.camera, Time.deltaTime); 
    }
}