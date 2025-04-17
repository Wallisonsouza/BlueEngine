// import Matrix4x4 from "../math/Matrix4x4";
// import Vector3 from "../math/Vector3";
// import Bounds from "./Bounds";
// import Camera from "./Camera";
// import Frustum from "./Frustum";
// import Plane from "./Plane";

// // Função para calcular o frustum a partir de uma matriz
// function calculateFrustum(matrix: Float32Array): Frustum {
//     const frustum = new Frustum();
//     frustum.planes.push(Plane.calculatePlane(matrix, 0, 1)); 
//     frustum.planes.push(Plane.calculatePlane(matrix, 0, -1));
//     frustum.planes.push(Plane.calculatePlane(matrix, 1, 1));
//     frustum.planes.push(Plane.calculatePlane(matrix, 1, -1));
//     frustum.planes.push(Plane.calculatePlane(matrix, 2, 1)); 
//     frustum.planes.push(Plane.calculatePlane(matrix, 2, -1));
//     return frustum;
// }

//  function containsBox(planes: Plane[], corners: Vector3[]): boolean {
        
//         for (const plane of planes) {
//             let allOutside = true;

//             for (const corner of corners) {
//                 const distance = plane.distanceToPoint(corner);

//                 if (distance >= 0) {
//                     allOutside = false;
//                     break; 
//                 }
//             }

//             if (allOutside) {
//                 return false; 
//             }
//         }
//         return true;
//     }

// // Listener para mensagens recebidas no Web Worker
// onmessage = function (event) {
//     const { type, data } = event.data;

//     switch (type) {
//         case 'processFrustum':
//             const { matrix, corners } = data;
//             const frustum = calculateFrustum(matrix);
//             const isInside = containsBox(frustum.planes, corners);
//             postMessage({ type: 'frustumResult', isInside });
//             break;

//         default:
//             postMessage({ type: 'error', message: 'Unrecognized message type' });
//             break;
//     }
// };
