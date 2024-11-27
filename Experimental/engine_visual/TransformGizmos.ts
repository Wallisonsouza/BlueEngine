// import Vector3 from "../../engine_modules/module_vectors/Vector3";
// import Ray from "../core/physics/Ray";
// import Gizmos from "../core/graphycs/Gizmos";
// import Transform from "../core/components/Transform";
// import Color from "../core/math/color";
// import Camera from "../core/components/Camera";

// export function drawTransformGizmos(transform: Transform) {

//     const camera = Camera.mainCamera;
//     const cameraPosition = camera.transform.position;

//     const distance = Math.max(0.1, Vector3.distance(transform.position, cameraPosition));

//     const t = distance * 0.2;
//     const globalXAxis = transform.right.multiplyScalar(t);
//     const globalYAxis = transform.up.multiplyScalar(t);
//     const globalZAxis = transform.forward.multiplyScalar(t);

//     const xEnd = transform.position.add(globalXAxis);
//     const yEnd = transform.position.add(globalYAxis);
//     const zEnd = transform.position.add(globalZAxis);

//     const cubeSize =  Vector3.fromNumber(0.1).multiplyScalar(t);

//     Gizmos.color = Color.red;
//     Gizmos.drawLine(transform.position, xEnd);
//     Gizmos.drawWireSphere(xEnd, cubeSize.x / 2);

//     Gizmos.color = Color.green;
//     Gizmos.drawLine(transform.position, yEnd);
//     Gizmos.drawWireCube(yEnd, cubeSize);

//     Gizmos.color = Color.blue;
//     Gizmos.drawLine(transform.position, zEnd);
//     Gizmos.drawWireCube(zEnd, cubeSize);
   
// }

// export function rayIntersectsLine(ray: Ray, start: Vector3, end: Vector3, threshold: number = 0.05): boolean {
//     const lineDir = end.subtract(start).normalize();
//     const lineLength = Vector3.distance(start, end);

//     // Projeção do ponto mais próximo no raio na linha
//     const projection = ray.direction.cross(lineDir).normalize();
//     const distance = Math.abs(ray.origin.subtract(start).dot(projection));

//     // Verifica se o ponto mais próximo está dentro da linha
//     const t = ray.direction.dot(end.subtract(ray.origin)) / ray.direction.dot(ray.direction);
//     const closestPoint = ray.origin.add(ray.direction.multiplyScalar(t));

//     // Verifica se está dentro da linha e se a distância é menor que o threshold
//     const withinLineBounds = closestPoint.subtract(start).length() <= lineLength;
//     return distance < threshold && withinLineBounds;
// }

