// import Component from "../../components/Component";
// import Vector3 from "../../../engine_modules/module_vectors/Vector3";
// import Time from "../../Engine/static/Time";
// import Quaternion from "../../../engine_modules/module_vectors/Quaternion";

// export class PhysicsConfig {
//     public static gravity: Vector3 = new Vector3(0, -9.80665, 0);
// }



// // /**
// //  * @
// //  */
// // // corrigir as funcoes de fisica como F = M * a;
// // // corrigir fisica de gravidade

// // export default class Rigidbody2D extends Component {
// //     mass: number;
// //     gravityScale: number;
// //     drag: number;
// //     angularDrag: number;
// //     velocity: Vector2;
// //     angularVelocity: number;

// //     constructor(
// //         mass: number = 1, 
// //         gravityScale: number = 1, 
// //         drag: number = 0, 
// //         angularDrag: number = 0.05
// //     ) {
// //         super();
// //         this.mass = mass;
// //         this.gravityScale = gravityScale;
// //         this.drag = drag;
// //         this.angularDrag = angularDrag;
// //         this.velocity = new Vector2(0, 0);
// //         this.angularVelocity = 0;
// //     }

// //     applyForce(force: Vector2): void {
// //         const acceleration = force.scale(1 / this.mass);
// //         this.velocity = this.velocity.add(acceleration); 
// //     }

// //     applyTorque(torque: number): void {
// //         const angularAcceleration = torque / this.mass;
// //         this.angularVelocity += angularAcceleration;
// //     }

// //     update(deltaTime: number): void {
// //         if (!this.gameObject) {
// //             return;
// //         }

// //         const dragFactor = 1 - Math.min(this.drag * deltaTime, 1);
// //         this.velocity = this.velocity.scale(dragFactor);

// //         this.velocity = this.velocity.add(PhysicsConfig.gravity.scale(this.gravityScale * deltaTime));

// //         const displacement = this.velocity.scale(deltaTime);
// //         this.gameObject.transform.position = this.gameObject.transform.position.add(new Vector3(displacement.x, displacement.y, 0)); // Adicionando Z = 0 para 2D
// //     }
// // }
