import Mathf from "../../src/core/math/Mathf";
import { KeyCode } from "../../src/core/input/KeyCode";
import Input from "../../src/core/input/Input";
import Quaternion from "../../src/core/math/Quaternion";
import Vector3 from "../../src/core/math/Vector3";
import Scrypt from "../../src/core/components/Scrypt";
import Time from "../../src/core/Time";

export default class CameraControler extends Scrypt {
    private targetPosition: Vector3 = Vector3.zero;
    private cameraRotation: Vector3 = new Vector3(0, 180, 0);
    private rotationSpeed: number = 0.1;
    private smoothingFactor: number = 20;

    private speed = 1;
    private maxSpeed = 2;
    private minSpeed = 0.02;
    public maxLerpFactor = 1;
    public minLerpFactor = 2;

    aceleration: boolean = true;

    public start(): void {
        this.targetPosition = this.transform.position;
        this.cameraRotation = Quaternion.toEulerAngles(this.transform.rotation);
    }

    
    public onUpdate(): void {
        this.handleInput(Time.deltaTime);
        this.smoothMovement(Time.deltaTime);
        this.smoothRotation(Time.deltaTime);
    }

    private handleInput(deltaTime: number): void {
        if (Input.getMouseButton(2)) {
            const delta = Input.mouseDelta;
            this.cameraRotation.y -= delta.x * this.rotationSpeed;
            this.cameraRotation.x -= delta.y * this.rotationSpeed;
        }

        let movement = Vector3.zero;

        if ( 
            Input.getKey(KeyCode.W) || 
            Input.getKey(KeyCode.S) || 
            Input.getKey(KeyCode.A) || 
            Input.getKey(KeyCode.D) || 
            Input.getKey(KeyCode.Space)
        ) {
            if (this.aceleration) {
                this.speed = Mathf.lerp(this.speed, this.maxSpeed, deltaTime * this.maxLerpFactor);
            } else {
                this.speed = this.maxSpeed;
            }

            movement = this.calculateMovement().normalize();
        } else {
            this.speed = Mathf.lerp(this.speed, this.minSpeed, deltaTime * this.minLerpFactor);
        }

        if (!movement.equals(Vector3.zero)) {
            movement = movement.normalize().scale(this.speed * 100 * deltaTime);
            this.targetPosition = this.transform.position.add(movement);
        }
    }

    private calculateMovement(): Vector3 {
        let movement = Vector3.zero;

        if (Input.getKey(KeyCode.W)) movement = movement.add(this.transform.forward.negative());
        if (Input.getKey(KeyCode.S)) movement = movement.add(this.transform.forward);
        if (Input.getKey(KeyCode.A)) movement = movement.add(this.transform.right.negative());
        if (Input.getKey(KeyCode.D)) movement = movement.add(this.transform.right);
        if (Input.getKey(KeyCode.Space)) movement = movement.add(this.transform.up);
        return movement;
    }

    private smoothMovement(deltaTime: number): void {
        const currentPosition = this.transform.position;
        const newPosition = Vector3.lerp(currentPosition, this.targetPosition, this.smoothingFactor * deltaTime);
        this.transform.position = newPosition;
    }

    private smoothRotation(deltaTime: number): void {
        if (this.cameraRotation.equals(Vector3.zero)) return;

        const oldRotation = this.transform.rotation;
        const rotation = Quaternion.fromEulerAnglesVector3(this.cameraRotation);
        const newRotation = Quaternion.slerp(oldRotation, rotation, this.smoothingFactor * deltaTime);
        this.transform.rotation = newRotation;
    }

    
}
