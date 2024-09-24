import Mathf from "../Base/Mathf/Mathf";
import Quaternion from "../../engine_modules/vectors/Quaternion";
import Vector3 from "../../engine_modules/vectors/Vector3";
import { KeyCode } from "./Enum/KeyCode";
import Input from "../Base/Input/Input";
import Camera from "../components/Camera";

export default class CameraController {
    
    private targetPosition: Vector3 = new Vector3(0, 0, 0);
    private cameraRotation: Vector3 = new Vector3(0, 0, 0);
    private rotationSpeed: number = 0.1;
    private smoothingFactor: number = 20;

    private speed = 1;
    private maxSpeed = 2;
    private minSpeed = 0.02;
    public maxLerpFactor = 1;
    public minLerpFactor = 2;

    aceleration: boolean = true;
 

    public update(camera: Camera, deltaTime: number): void {
        this.handleInput(camera, deltaTime);
        this.smoothMovement(camera, deltaTime);
        this.smoothRotation(camera, deltaTime);
    }

    private handleInput(camera: Camera, deltaTime: number): void {
        if (Input.getMouseButton(2)) {
            const delta = Input.mouseDelta;
            this.cameraRotation.y -= delta.x * this.rotationSpeed;
            this.cameraRotation.x -= delta.y * this.rotationSpeed;
        }

        let movement = Vector3.zero;

        if(Input.getKey(KeyCode.W) || Input.getKey(KeyCode.S) || Input.getKey(KeyCode.A) || Input.getKey(KeyCode.D)) {
            
            if (this.aceleration) {
                this.speed = Mathf.lerp(this.speed, this.maxSpeed, deltaTime * this.maxLerpFactor);
            } else {
                this.speed = this.maxSpeed;
            }

            if (Input.getKey(KeyCode.W)) {
                movement = camera.transform.backward;
            }
            if (Input.getKey(KeyCode.S)) {
                movement = camera.transform.forward;
            }
            if (Input.getKey(KeyCode.D)) {
                movement = camera.transform.right;
            }
            if (Input.getKey(KeyCode.A)) {
                movement = camera.transform.left;
               
            }
        } else {
            this.speed = Mathf.lerp(this.speed, this.minSpeed, deltaTime * this.minLerpFactor);
        }
        if (!movement.equals(Vector3.zero)) {
            movement = movement.normalize().scale(this.speed * 100 * deltaTime);
            this.targetPosition = camera.transform.position.add(movement);
        }
    }

    private smoothMovement(camera: Camera, deltaTime: number): void {
        const currentPosition = camera.transform.position;
        const newPosition = Vector3.lerp(currentPosition, this.targetPosition, this.smoothingFactor * deltaTime);
        camera.transform.position = newPosition;
    }

    private smoothRotation(camera: Camera, deltaTime: number): void {
        if (this.cameraRotation.equals(Vector3.zero)) return;

        const oldRotation = camera.transform.rotation;
        const rotation = Quaternion.fromEulerAngles(this.cameraRotation);
        const newRotation = Quaternion.slerp(oldRotation, rotation, this.smoothingFactor * deltaTime);
        camera.transform.rotation = newRotation;
        camera.transform.rotation = newRotation;
    }
}