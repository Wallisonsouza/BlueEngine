// import MeshFactory from "../../factory/MeshFactory";
// import { BufferManager } from "../../managers/BufferManager";
// import Vector3 from "../../math/Vector3";
// import Mesh from "./Mesh";
// import PerlinNoise from "./PerlinNoise";

// export default class TerrainGenerator {
//     private perlin: PerlinNoise;

//     constructor(seed?: number) {
//         // Gera uma seed aleatória caso nenhuma seja fornecida
//         const randomSeed = seed ?? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
//         this.perlin = new PerlinNoise(randomSeed);
//         console.log(`Seed utilizada: ${randomSeed}`);
//     }

//     public generateTerrainMesh(
//         width: number = 500,
//         depth: number = 500,
//         scale: number = 0.1,  // Ajuste da escala para o ruído geral
//         heightScale: number = 10, // Escala da altura
//         islandRadius: number = 0.5, // Tamanho da ilha
//         islandHeight: number = 20, // Altura máxima da ilha
//         smoothness: number = 3, // Suavização das bordas
//         smoothFactor: number = 0.5 // Fator de suavização do Perlin Noise
//     ) {
//         // Criação da malha base
//         const mesh = MeshFactory.createPlane(width, depth, width * 2, depth * 2);

//         // Garantir que a malha tenha vértices
//         if (mesh.vertices && mesh.vertices.length > 0) {
//             for (let i = 0; i < mesh.vertices.length; i++) {
//                 const vertexPosition = mesh.vertices[i];

//                 // Calcular a distância do ponto para o centro (para formar a ilha)
//                 const distanceToCenter = Math.sqrt(
//                     Math.pow(vertexPosition.x - width / 2, 2) + Math.pow(vertexPosition.z - depth / 2, 2)
//                 );

//                 // Base do Perlin Noise para o terreno
//                 let fbmHeight = 0;
//                 let amplitude = 1;
//                 let frequency = scale;

//                 // Aplicando múltiplas camadas de Perlin Noise para variação de altura
//                 for (let octave = 0; octave < 4; octave++) {
//                     fbmHeight += this.perlin.noise(
//                         vertexPosition.x * frequency,
//                         vertexPosition.y, // Ignorando o eixo Y (altura) no cálculo de ruído
//                         vertexPosition.z * frequency
//                     ) * amplitude;

//                     amplitude *= 0.5; // A cada camada, a intensidade vai diminuindo
//                     frequency *= 2;  // Incrementar a frequência para detalhes mais finos
//                 }

//                 // Ajustar a altura para formar uma ilha (mais alta no centro e mais baixa nas bordas)
//                 const normalizedDistance = Math.min(distanceToCenter / (width / 2), 1); // Normaliza a distância
//                 const islandFactor = Math.pow(1 - normalizedDistance, smoothness); // Suaviza a transição para as bordas da ilha

//                 // Calcular a altura total e aplicar suavização adicional
//                 const totalHeight = fbmHeight * heightScale * islandFactor;

//                 // Suavização adicional para evitar "fios" ou "cabelos"
//                 const smoothHeight = totalHeight * (1 - smoothFactor) + smoothFactor * Math.random();

//                 mesh.vertices[i].y = smoothHeight; // Atualiza a altura do vértice
//             }
//         } else {
//             console.warn("A malha não contém vértices ou está vazia.");
//         }

//         // Recalcular as normais da malha após atualizar os vértices
//         mesh.recalculateNormals();

//         return mesh;
//     }
// }
