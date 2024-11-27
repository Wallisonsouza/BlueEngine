import Mesh from "../graphics/mesh/Mesh";
import Vector2 from "../math/Vector2";
import Vector3 from "../math/Vector3";

export default class MeshFactory {

    public static createCube(size: Vector3 = new Vector3(1, 1, 1)): Mesh {
        const halfSize = size.x / 2; 
    
        const vertices: Vector3[] = [
            // Face frontal
            new Vector3(-halfSize, -halfSize,  halfSize),   // V0
            new Vector3( halfSize, -halfSize,  halfSize),   // V1
            new Vector3( halfSize,  halfSize,  halfSize),   // V2
            new Vector3(-halfSize,  halfSize,  halfSize),   // V3
    
            // Face traseira
            new Vector3(-halfSize, -halfSize, -halfSize),   // V4
            new Vector3( halfSize, -halfSize, -halfSize),   // V5
            new Vector3( halfSize,  halfSize, -halfSize),   // V6
            new Vector3(-halfSize,  halfSize, -halfSize),   // V7
    
            // Face esquerda
            new Vector3(-halfSize, -halfSize, -halfSize),   // V4
            new Vector3(-halfSize, -halfSize,  halfSize),   // V0
            new Vector3(-halfSize,  halfSize,  halfSize),   // V3
            new Vector3(-halfSize,  halfSize, -halfSize),   // V7
    
            // Face direita
            new Vector3( halfSize, -halfSize, -halfSize),   // V5
            new Vector3( halfSize, -halfSize,  halfSize),   // V1
            new Vector3( halfSize,  halfSize,  halfSize),   // V2
            new Vector3( halfSize,  halfSize, -halfSize),   // V6
    
            // Face superior
            new Vector3(-halfSize,  halfSize, -halfSize),   // V7
            new Vector3(-halfSize,  halfSize,  halfSize),   // V3
            new Vector3( halfSize,  halfSize,  halfSize),   // V2
            new Vector3( halfSize,  halfSize, -halfSize),   // V6
    
            // Face inferior
            new Vector3(-halfSize, -halfSize, -halfSize),   // V4
            new Vector3(-halfSize, -halfSize,  halfSize),   // V0
            new Vector3( halfSize, -halfSize,  halfSize),   // V1
            new Vector3( halfSize, -halfSize, -halfSize)    // V5
        ];
    
        const normals: Vector3[] = [
            // Normais para cada face
            new Vector3(0, 0, 1),  // Face frontal
            new Vector3(0, 0, 1),
            new Vector3(0, 0, 1),
            new Vector3(0, 0, 1),
    
            new Vector3(0, 0, -1), // Face traseira
            new Vector3(0, 0, -1),
            new Vector3(0, 0, -1),
            new Vector3(0, 0, -1),
    
            new Vector3(-1, 0, 0), // Face esquerda
            new Vector3(-1, 0, 0),
            new Vector3(-1, 0, 0),
            new Vector3(-1, 0, 0),
    
            new Vector3(1, 0, 0),  // Face direita
            new Vector3(1, 0, 0),
            new Vector3(1, 0, 0),
            new Vector3(1, 0, 0),
    
            new Vector3(0, 1, 0),  // Face superior
            new Vector3(0, 1, 0),
            new Vector3(0, 1, 0),
            new Vector3(0, 1, 0),
    
            new Vector3(0, -1, 0), // Face inferior
            new Vector3(0, -1, 0),
            new Vector3(0, -1, 0),
            new Vector3(0, -1, 0)
        ];
    
        const uvs: Vector2[] = [
            // Coordenadas de textura (UV)
            new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1), new Vector2(0, 1), // Face frontal
            new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1), new Vector2(0, 1), // Face traseira
            new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1), new Vector2(0, 1), // Face esquerda
            new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1), new Vector2(0, 1), // Face direita
            new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1), new Vector2(0, 1), // Face superior
            new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1), new Vector2(0, 1)  // Face inferior
        ];
    
        const triangles = [
            // Índices para desenhar as faces
            0, 1, 2, 0, 2, 3,  // Face frontal
            4, 5, 6, 4, 6, 7,  // Face traseira
            8, 9, 10, 8, 10, 11, // Face esquerda
            12, 13, 14, 12, 14, 15, // Face direita
            16, 17, 18, 16, 18, 19, // Face superior
            20, 21, 22, 20, 22, 23  // Face inferior
        ];
    
        return new Mesh(
            Vector3.arrayToF32Array(vertices), 
            Vector3.arrayToF32Array(normals),
            Vector2.arrayToF32Array(uvs), 
            new Uint16Array(triangles)
        );
    }
   
    public static createSphere(radius: number = 1, latitudes: number = 64, longitudes: number = 64): Mesh {
        const vertices: Vector3[] = [];
        const normals: Vector3[] = [];
        const uvs: Vector2[] = [];
        const indices: number[] = [];
    
        // Gerar vértices, normais e coordenadas UV
        for (let lat = 0; lat <= latitudes; lat++) {
            const theta = lat * Math.PI / latitudes; // Ângulo latitudinal
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);
            
            // Ajuste para V usando a latitude, diminuindo esticamento próximo aos polos
            const v = lat / latitudes;
    
            for (let lon = 0; lon <= longitudes; lon++) {
                const phi = lon * 2 * Math.PI / longitudes; // Ângulo longitudinal
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);
    
                const u = lon  / longitudes; // Coordenada U (longitude)
    
                // Adiciona os dados
                vertices.push(new Vector3(radius * cosPhi * sinTheta, radius * cosTheta, radius * sinPhi * sinTheta));
                normals.push(new Vector3(cosPhi * sinTheta, cosTheta, sinPhi * sinTheta)); // Adiciona as normais
    
                // Mapeamento UV ajustado para reduzir esticamento
                uvs.push(new Vector2(u, 1 - v )); // Ajusta o V
            }
        }
    
        // Gerar índices
        for (let lat = 0; lat < latitudes; lat++) {
            for (let lon = 0; lon < longitudes; lon++) {
                const first = (lat * (longitudes + 1)) + lon;
                const second = first + (longitudes + 1);
    
                // Adiciona os índices das faces
                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }
    
        return new Mesh(
            Vector3.arrayToF32Array(vertices), 
            Vector3.arrayToF32Array(normals), 
            Vector2.arrayToF32Array(uvs), 
            new Uint16Array(indices)
        );
    }

    public static createSubdividedPlane(width: number = 1, depth: number = 1, subdivisionsX: number = 10, subdivisionsZ: number = 10): Mesh {
    
        const vertices: Vector3[] = [];
        const normals: Vector3[] = [];
        const uvs: Vector2[] = [];
        const indices: number[] = [];
    
        // Passo para subdividir o plano ao longo dos eixos X e Z
        const stepX = width / subdivisionsX;
        const stepZ = depth / subdivisionsZ;
    
        // Geração dos vértices, normais e UVs
        for (let z = 0; z <= subdivisionsZ; z++) {
            for (let x = 0; x <= subdivisionsX; x++) {
                // Posição do vértice
                const posX = x * stepX - width / 2;  // Centraliza no eixo X
                const posZ = z * stepZ - depth / 2;  // Centraliza no eixo Z
                vertices.push(new Vector3(posX, 0, posZ));
    
                // Normal apontando para cima
                normals.push(new Vector3(0, 1, 0));
    
                // Coordenadas UV
                const u = x / subdivisionsX;
                const v = z / subdivisionsZ;
                uvs.push(new Vector2(u, v));
            }
        }
    
        // Geração dos índices para conectar os vértices
        for (let z = 0; z < subdivisionsZ; z++) {
            for (let x = 0; x < subdivisionsX; x++) {
                // Cálculo dos índices dos vértices
                const topLeft = z * (subdivisionsX + 1) + x;
                const topRight = topLeft + 1;
                const bottomLeft = topLeft + subdivisionsX + 1;
                const bottomRight = bottomLeft + 1;
    
                // Primeiro triângulo do quad
                indices.push(topLeft, bottomLeft, topRight);
                // Segundo triângulo do quad
                indices.push(topRight, bottomLeft, bottomRight);
            }
        }
    
        // Retorna a malha com os dados gerados
        return new Mesh(
            Vector3.arrayToF32Array(vertices), 
            Vector3.arrayToF32Array(normals),
            Vector2.arrayToF32Array(uvs), 
            new Uint32Array(indices)
        );
    }
}