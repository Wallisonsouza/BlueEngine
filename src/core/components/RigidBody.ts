// import Time from "../Time";
// import { ForceMode } from "../enum/ForceMode";
// import { RenderMode } from "../enum/RenderMode";
// import Gizmos from "../../../deprecated/Gizmos";
// import Quaternion from "../math/Quaternion";
// import Vector3 from "../math/Vector3";
// import Color from "../math/color";
// import CollisionData from "./collision/CollisionData";
// import Component from "./Component";

// export default class Rigidbody extends Component {
//     public mass: number;
//     public drag: number;
//     public angularDrag: number;
//     public useGravity: boolean;
//     public gravity: Vector3;
//     public velocity: Vector3;
//     public angularVelocity: Vector3; // Velocidade angular
//     public centerOfMass: Vector3;

//     private continuousForces: Vector3; // Forças contínuas acumuladas
//     private impulseForces: Vector3;    // Forças instantâneas acumuladas
//     private torque: Vector3;          // Torque acumulado

//     constructor() {
//         super("RigidBody", "RigidBody");
//         this.mass = 1.0;
//         this.drag = 0.1;
//         this.angularDrag = 0.05;
//         this.useGravity = true;
//         this.gravity = new Vector3(0, -9.807, 0);
//         this.velocity = Vector3.zero;
//         this.angularVelocity = Vector3.zero;
//         this.centerOfMass = Vector3.zero;

//         this.continuousForces = Vector3.zero;
//         this.impulseForces = Vector3.zero;
//         this.torque = Vector3.zero;
//     }

//     /**
//      * Aplica uma força ao Rigidbody.
//      * @param force Vetor da força.
//      * @param mode Define se a força é contínua ou um impulso instantâneo.
//      */
//     public addForce(force: Vector3, mode: ForceMode = ForceMode.FORCE): void {
//         if (mode === ForceMode.FORCE) {
//             this.continuousForces = this.continuousForces.add(force);
//         } else if (mode === ForceMode.IMPULSE) {
//             this.impulseForces = this.impulseForces.add(force);
//         }
//     }

//     /**
//      * Aplica uma força em uma posição específica, causando rotação.
//      */
//     public addForceAtPosition(force: Vector3, position: Vector3, mode: ForceMode = ForceMode.FORCE): void {
//         const effectiveForce = mode === ForceMode.FORCE ? force : force.divideScalar(this.mass);

//         // Atualiza a força linear
//         this.addForce(effectiveForce, mode);

//         const relativePosition = position.subtract(this.centerOfMass);
//         this.torque = this.torque.add(relativePosition.cross(effectiveForce));
//     }

//     private calculateDragFactor(dragFactor: number, deltaTime: number): number {
//         return Math.max(0, 1 - dragFactor * deltaTime);
//     }

//     /**
//      * Reseta a velocidade e torque do Rigidbody.
//      */
//     public resetVelocity(): void {
//         this.velocity = Vector3.zero;
//         this.angularVelocity = Vector3.zero;
//         this.torque = Vector3.zero;
//     }

//     public fixedUpdate(): void {
      
//         if (this.useGravity) {
//             this.continuousForces = this.continuousForces.add(this.gravity.multiplyScalar(this.mass));
//         }

//         // Aplica todas as forças acumuladas
//         const totalForces = this.continuousForces.add(this.impulseForces);
//         const acceleration = totalForces.divideScalar(this.mass);
//         this.velocity = this.velocity.add(acceleration.multiplyScalar(Time.fixedDeltaTime));

//         // Limpa as forças instantâneas
//         this.impulseForces = Vector3.zero;

//         // Aplica arrasto linear
//         const linearDragFactor = this.calculateDragFactor(this.drag, Time.fixedDeltaTime);
//         this.velocity = this.velocity.multiplyScalar(linearDragFactor);

//         // Atualiza posição
//         this.transform.position = this.transform.position.add(this.velocity.multiplyScalar(Time.fixedDeltaTime));

//         // Atualiza rotação com torque
//         const angularAcceleration = this.torque.divideScalar(this.mass);
//         this.angularVelocity = this.angularVelocity.add(angularAcceleration.multiplyScalar(Time.fixedDeltaTime));

//         // Aplica arrasto angular
//         const angularDragFactor = this.calculateDragFactor(this.angularDrag, Time.fixedDeltaTime);
//         this.angularVelocity = this.angularVelocity.multiplyScalar(angularDragFactor);

//         // Atualiza rotação
//         this.transform.rotation = Quaternion.multiplyQuat(
//             this.transform.rotation,
//             Quaternion.fromEulerAnglesVector3(this.angularVelocity.multiplyScalar(Time.fixedDeltaTime))
//         );

//         this.continuousForces = Vector3.zero;
//         this.torque = Vector3.zero;

//     }


//     public onCollisionEnter(data: CollisionData): void {
//         this.useGravity = false;
//         this.resetVelocity();
      
//     }

//     public onCollisionStay(data: CollisionData): void {
//         this.useGravity = false;
//         this.resetVelocity();

//     }
    
//     public onCollisionExit(data: CollisionData): void {
//         this.useGravity = true;
//     }

//     public onDrawGizmos(): void {
//         // Gizmos.color = Color.YELLOW;
//         // const center = this.centerOfMass.add(this.transform.position);
//         // Gizmos.drawSphere(center, 1.0, Quaternion.IDENTITY, RenderMode.TRIANGLES)
//     }
// }
