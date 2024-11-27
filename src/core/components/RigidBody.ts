import Time from "../Time";
import Quaternion from "../math/Quaternion";
import Vector3 from "../math/Vector3";
import Component from "./Component";


export enum ForceMode {
    Force,
    Impulse
}

export default class Rigidbody extends Component {
    public mass: number;
    public drag: number;
    public angularDrag: number;
    public useGravity: boolean;
    public gravity: Vector3;
    public velocity: Vector3;
    public angularVelocity: Vector3; // Velocidade angular
    public centerOfMass: Vector3;

    private torque: Vector3; // Acumulador para torque

    constructor() {
        super();
        this.mass = 1.0;
        this.drag = 0.1;
        this.angularDrag = 0.05;
        this.useGravity = true;
        this.gravity = new Vector3(0, -9.807, 0);
        this.velocity = Vector3.zero;
        this.angularVelocity = Vector3.zero;
        this.centerOfMass = Vector3.zero;
        this.torque = Vector3.zero;
    }

    // Aplica uma força ou um impulso instantâneo
    public addForce(force: Vector3, mode: ForceMode = ForceMode.Force): void {
        const acceleration = force.divideScalar(this.mass);
        switch (mode) {
            case ForceMode.Force:
                this.velocity = this.velocity.add(acceleration.multiplyScalar(Time.fixedDeltaTime));
                break;
            case ForceMode.Impulse:
                this.velocity = this.velocity.add(acceleration);
                break;
        }
    }

    // Aplica uma força em uma posição específica, causando rotação se não for no centro de massa
    public addForceAtPosition(force: Vector3, position: Vector3, mode: ForceMode = ForceMode.Force): void {
        const effectiveForce = mode === ForceMode.Force ? force.multiplyScalar(Time.fixedDeltaTime) : force;

        // Atualiza a velocidade linear
        this.addForce(effectiveForce, mode);
        
        const relativePosition = position.subtract(this.centerOfMass); // Vetor posição relativo ao centro de massa
        this.torque = this.torque.add(relativePosition.cross(effectiveForce)); // Acumula o torque
    }

    private calculateDragFactor(dragFactor: number, deltaTime: number): number {
        return 1 - (dragFactor * deltaTime);
    }

    // Atualiza o estado do Rigidbody a cada frame
    public update(deltaTime: number = Time.fixedDeltaTime): void {
        // Aplica gravidade, se necessário
        if (this.useGravity) {
            const gravityForce = this.gravity.multiplyScalar(this.mass); // F = m * g
            this.addForce(gravityForce, ForceMode.Force);
        }

        // Aplica arrasto linear à velocidade
        const linearDragFactor = this.calculateDragFactor(this.drag, deltaTime);
        this.velocity = this.velocity.multiplyScalar(linearDragFactor);

        // Atualiza a posição do objeto
        this.transform.position = this.transform.position.add(this.velocity.multiplyScalar(deltaTime));

        // Calcula a aceleração angular e atualiza a rotação
        this.angularVelocity = this.angularVelocity.add(this.torque.divideScalar(this.mass).multiplyScalar(deltaTime));
        
        // Aplica arrasto angular
        const angularDragFactor = this.calculateDragFactor(this.angularDrag, deltaTime);
        this.angularVelocity = this.angularVelocity.multiplyScalar(angularDragFactor);

        // Atualiza a rotação do objeto com base na velocidade angular
        this.transform.rotation = Quaternion.multiplyQuat(
            this.transform.rotation,
            Quaternion.fromEulerAngles(this.angularVelocity.multiplyScalar(deltaTime))
        );

        // Reseta o torque acumulado para o próximo frame
        this.torque = Vector3.zero;
    }

    // Reseta a velocidade do Rigidbody
    public resetVelocity(): void {
        this.velocity = Vector3.zero;
        this.angularVelocity = Vector3.zero;
    }
}
