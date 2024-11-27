import CameraControler from "./core/CameraControler";

import Time from "./core/Time";
import Camera from "./core/components/Camera";
import MonoComportament from "./core/components/MonoComportament";

export default class SimpleEngine extends MonoComportament {

    cameraControle: CameraControler = new CameraControler();

    public start(): void {
        Camera.mainCamera.farPlane = 2000;
    }
    
    public update(): void { 
        this.cameraControle.update(Camera.mainCamera.transform, Time.deltaTime); 
    }
}