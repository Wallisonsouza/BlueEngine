
// export default class TerrainGenerator {
//     private perlin: PerlinNoise3D;

  
//     constructor(seed?: number) {
//         // Gera uma seed aleatória caso nenhuma seja fornecida
//         const randomSeed = seed ?? Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
//         this.perlin = new PerlinNoise3D(randomSeed);
//         console.log(`Seed utilizada: ${randomSeed}`);
//     }
//     public generateTerrain(
//         width: number = 100,
//         depth: number = 100,
//         scale: number = 0.1,
//         heightScale: number = 10,
//         octaves: number = 4,
//         persistence: number = 0.5,
//         smoothnessFactor: number = 2,
//         edgeSmoothness: number = 0.2,
//         treeThreshold: number = 5, // Altura mínima para gerar árvores
//         treeDensity: number = 0.1 // Probabilidade de gerar uma árvore em um ponto adequado
//     ): { terrain: Mesh, trees: Vector3[] } {
//         // Criação da malha base
//         const mesh = MeshBuilder.createSubdividedPlane(width, depth, width * 2, depth * 2);
    
//         // Lista para armazenar as posições das árvores
//         const trees: Vector3[] = [];
    
//         // Garantir que a malha tenha vértices
//         if (mesh.vertices) {
//             for (let i = 0; i < mesh.vertices.length; i += 3) {
//                 const vertexPosition = new Vector3(
//                     mesh.vertices[i],
//                     mesh.vertices[i + 1],
//                     mesh.vertices[i + 2]
//                 );
    
//                 // Gerar a altura usando o Perlin Noise (ou FBM se for o caso)
//                 const fbmHeight = this.perlin.noise(
//                     vertexPosition.x * scale,
//                     vertexPosition.y,
//                     vertexPosition.z * scale
//                 ) * heightScale;
    
//                 // Aplicar o fator de suavização ao valor da altura
//                 let smoothedHeight = fbmHeight;
//                 mesh.vertices[i + 1] = smoothedHeight;
    
//                 // Verificar se a altura do ponto é suficiente para gerar uma árvore
//                 if (smoothedHeight > treeThreshold && Math.random() < treeDensity) {
//                     // Adicionar a posição da árvore
//                     trees.push(new Vector3(vertexPosition.x, smoothedHeight, vertexPosition.z));
//                 }
//             }
//         }
    
//         // Recalcular as normais para a iluminação correta
//         mesh.recalculateNormals();
    
//         // Retorna a malha e as árvores geradas
//         return { terrain: mesh, trees };
//     }
    
    
    
    
    
// }
