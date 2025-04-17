import Camera from "../../components/Camera";
import GameObject from "../../components/GameObject";
import Vector3 from "../../math/Vector3";

export default class CameraObject {
    
    public static createMainCamera(): GameObject {
        const cameraObject = new GameObject("Camera");
        cameraObject.tag = "MainCamera";
        cameraObject.addComponent(Camera);
        cameraObject.transform.position = new Vector3(0, 0, 10);
        return cameraObject;
    }

    public static create(): GameObject {
        const cameraObject = new GameObject("Camera");
        cameraObject.addComponent(Camera);
        cameraObject.transform.position = new Vector3(0, 0, 10);
        return cameraObject;
    }
}