import Mathf from "./math/Mathf";
import { KeyCode } from "./input/KeyCode";
import Input from "./input/Input";
import Transform from "./components/Transform";
import Quaternion from "./math/Quaternion";
import Vector3 from "./math/Vector3";

export default class CameraControler {
    
    private targetPosition: Vector3 = Vector3.zero
    private cameraRotation: Vector3 = new Vector3(0,180, 0);
    private rotationSpeed: number = 0.1;
    private smoothingFactor: number = 20;

    private speed = 1;
    private maxSpeed = 2;
    private minSpeed = 0.02;
    public maxLerpFactor = 1;
    public minLerpFactor = 2;

    aceleration: boolean = true;

    public update(t: Transform, deltaTime: number): void {
        this.handleInput(t, deltaTime);
        this.smoothMovement(t, deltaTime);
        this.smoothRotation(t, deltaTime);
    }

    private handleInput(t: Transform, deltaTime: number): void {
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
                movement = Vector3.negate(t.forward);
            }
            if (Input.getKey(KeyCode.S)) {
               
                movement = t.forward;
            }
            if (Input.getKey(KeyCode.A)) {
                movement = Vector3.negate(t.right);
            }
            if (Input.getKey(KeyCode.D)) {
                movement = t.right;
               
            }
        } else {
            this.speed = Mathf.lerp(this.speed, this.minSpeed, deltaTime * this.minLerpFactor);
        }
        if (!movement.equals(Vector3.zero)) {
            movement = movement.normalize().scale(this.speed * 100 * deltaTime);
            this.targetPosition = t.position.add(movement);
        }
    }

    private smoothMovement(t: Transform, deltaTime: number): void {
        const currentPosition = t.position;
        const newPosition = Vector3.lerp(currentPosition, this.targetPosition, this.smoothingFactor * deltaTime);
       t.position = newPosition;
    }

    private smoothRotation(t: Transform, deltaTime: number): void {
        if (this.cameraRotation.equals(Vector3.zero)) return;

        const oldRotation = t.rotation;
        const rotation = Quaternion.fromEulerAngles(this.cameraRotation);
        const newRotation = Quaternion.slerp(oldRotation, rotation, this.smoothingFactor * deltaTime);
        t.rotation = newRotation;
        t.rotation = newRotation;
    }
}