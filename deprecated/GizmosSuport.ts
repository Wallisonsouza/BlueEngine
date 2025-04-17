// import Camera from "../src/core/components/Camera";
// import GameObject from "../src/core/components/GameObject";
// import Scrypt from "../src/core/components/Scrypt";
// import Transform from "../src/core/components/Transform";
// import Gizmos from "../src/core/factory/Gizmos";
// import Input from "../src/core/input/Input";
// import Color from "../src/core/math/color";
// import Mathf from "../src/core/math/Mathf";
// import Vector3 from "../src/core/math/Vector3";
// import { Physics } from "../src/core/physics/Physics";
// import RayCast from "../src/core/physics/RayCast";

// type Intersect = {
//     x: Vector3 | null;
//     y: Vector3 | null;
//     z: Vector3 | null;
// }
// type Axis = "X" | "Y" | "Z" | null;

// export default class GizmosSuport extends Scrypt {

//     private currentObject: GameObject | null = null;
//     private intersect: Intersect = { x: null, y: null, z: null };

//     public update(): void {

//         const camera = Camera.mainCamera;
        
//         // Verifica se o mouse foi clicado sobre um dos eixos (X, Y, Z)
//         if (Input.getMouseButtonDown(0) && !this.intersect.x && !this.intersect.y && !this.intersect.z) {
//             const ray = camera.screenPointToRay(Input.mousePosition);
//             const rayCastData = Physics.meshCast(ray);
//             if (rayCastData) {
//                 if (this.currentObject) {
//                     this.currentObject.transform.isSelected = false;
//                 }
//                 this.currentObject = rayCastData.gameObject;
//                 this.currentObject.transform.isSelected = true;
//             } else {
//                 if (this.currentObject) {
//                     this.currentObject.transform.isSelected = false;
//                 }
//                 this.currentObject = null;
//             }
//         }

//         if (this.currentObject) {
//             const transform = this.currentObject.transform;
//             this.intersect = this.drawTransformGizmos(transform, {
//                     x: Color.RED,
//                     y: Color.GREEN,
//                     z: Color.BLUE
//                 },
//                 true,
//                 {
//                     x: Color.RED.blend(Color.BLACK, 0.5),
//                     y: Color.GREEN.blend(Color.BLACK, 0.5),
//                     z: Color.BLUE.blend(Color.BLACK, 0.5)
//                 },
//             );

//             if (Input.getMouseButton(0)) {
            
//                 // Distância entre o objeto e a câmera (pode ser usada para ajuste de escala)
//                 const distance = transform.position.distanceTo(camera.transform.position);
//                 // Aqui é onde ocorre a mágica - converte a posição do mouse para o espaço 3D
//                 // Obtemos a posição do cursor na tela (coordenadas do mouse)
//                 const mousePosition = Input.mousePosition;
            
//                 // Projeta o ponto do mouse no plano 3D com base na posição da câmera
//                 const ray = camera.screenPointToRay(mousePosition);  // Lança um raio da câmera até o ponto no plano 3D
            
//                 // Calcula o ponto 3D em que o raio intercepta o plano
//                 const intersectionPoint = ray.origin.add(ray.direction.multiplyScalar(distance));
            
//                 // Agora, vamos mover o objeto baseado na posição projetada no espaço 3D
//                 // Movemos o objeto para a nova posição calculada
//                 if (this.axis === "X") {
//                     transform.position.x = intersectionPoint.x;
//                 } else if (this.axis === "Y") {
//                     transform.position.y = intersectionPoint.y;
//                 } else if (this.axis === "Z") {
//                     transform.position.z = intersectionPoint.z;
//                 }
//             }
//         }
//     }

//     private axis: Axis = null;
//     private drawTransformGizmos(
//         transform: Transform,
//         defaultColor: { x: Color, y: Color, z: Color },
//         checkCollision?: boolean,
//         selectedColor?: { x: Color, y: Color, z: Color }
//     ) {
//         const camera = Camera.mainCamera;
//         const cameraPosition = camera.transform.position;
//         let distance = Vector3.distance(transform.position, cameraPosition);
//         distance = Mathf.clamp(distance, 0.1, Infinity);
//         const scale = distance * 0.2;

//         const globalXAxis = transform.right.multiplyScalar(scale);
//         const globalYAxis = transform.up.multiplyScalar(scale);
//         const globalZAxis = transform.forward.multiplyScalar(scale);

//         const xEnd = transform.position.add(globalXAxis);
//         const yEnd = transform.position.add(globalYAxis);
//         const zEnd = transform.position.add(globalZAxis);

//         if (checkCollision) {
//             const ray = camera.screenPointToRay(Input.mousePosition);

//             const intersect = {
//                 x: RayCast.intersectsLine(ray, transform.position, xEnd, 0.05 * scale),
//                 y: RayCast.intersectsLine(ray, transform.position, yEnd, 0.05 * scale),
//                 z: RayCast.intersectsLine(ray, transform.position, zEnd, 0.05 * scale),
//             };

//             // Quando um eixo é selecionado, o movimento será restrito a esse eixo
//             Gizmos.color = intersect.x ? selectedColor?.x ?? defaultColor.x : defaultColor.x;
//             Gizmos.drawLine(transform.position, xEnd);
//             Gizmos.color = intersect.y ? selectedColor?.y ?? defaultColor.y : defaultColor.y;
//             Gizmos.drawLine(transform.position, yEnd);
//             Gizmos.color = intersect.z ? selectedColor?.z ?? defaultColor.z : defaultColor.z;
//             Gizmos.drawLine(transform.position, zEnd);

//             if(Input.getMouseButtonDown(0)) {
//                 if(intersect.x) {
//                     this.axis = "X";
//                 } else if(intersect.y) {
//                     this.axis = "Y";
//                 } else if(intersect.z) {
//                     this.axis = "Z";
//                 }
//             }

//             if(Input.getMouseButtonUp(0)) {
//                 this.axis = null;
//             }

//             return intersect;
//         }

//         return { x: null, y: null, z: null , axis: this.axis};
//     }
// }

