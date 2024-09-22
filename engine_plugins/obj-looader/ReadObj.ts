import { Material as ObjMaterial, ObjMesh as ObjMesh, Vec2, Vec3 } from "./ObjRepresentation";


type objecsData = {name: string, data: string[]};

export default class ReadObj {

   // Método para extrair objetos a partir do texto OBJ
   public static getObjects(objText: string): objecsData[] {
    // Dividindo o texto por quebras de linha diferentes (Windows, Unix, antigos Mac)
    const lines = objText.trim().split(/\r\n|\n|\r/);
    
    const objectPattern = /^o\s+(.+)$/; // Regex para identificar novos objetos
    const objectsData: objecsData[] = [];

    let currentObjectName: string | null = null;
    let currentObjectData: string[] = [];

    // Processa cada linha do arquivo
    for (const line of lines) {
        const trimmedLine = line.trim(); // Remove espaços em branco extras

        // Ignora linhas vazias ou inválidas
        if (!trimmedLine) {
            continue;
        }

        const match = trimmedLine.match(objectPattern); // Verifica se é a definição de um novo objeto
        if (match) {
            // Se já temos um objeto em andamento, finalize e salve seus dados
            if (currentObjectName && currentObjectData.length > 0) {
                objectsData.push({
                    name: currentObjectName,
                    data: currentObjectData
                });
            }

            // Inicia um novo objeto
            currentObjectName = match[1]; // Nome do objeto
            currentObjectData = []; // Reinicia os dados do novo objeto
        } else if (currentObjectName) {
            // Acumula os dados do objeto atual
            currentObjectData.push(trimmedLine);
        }
    }

    // Verifica se há um último objeto a ser adicionado
    if (currentObjectName && currentObjectData.length > 0) {
        objectsData.push({
            name: currentObjectName,
            data: currentObjectData
        });
    }

    console.log(objectsData);
    return objectsData;
}
    private static processLine(line: string, object: ObjMesh) {
        const patterns = [
            { regex: /^\s*v\s+/, handler: this.processVertex, sliceLength: 2 },
            { regex: /^\s*vn\s+/, handler: this.processNormal, sliceLength: 3 },
            { regex: /^\s*vt\s+/, handler: this.processTexCoord, sliceLength: 3 },
            { regex: /^\s*f\s+/, handler: this.processFace, sliceLength: 2 }
        ];

        for (const pattern of patterns) {
            if (pattern.regex.test(line)) {
                const data = line.slice(pattern.sliceLength).trim();
                const processedData = pattern.handler.call(this, data);
                
                if (pattern.handler === this.processVertex) {
                    object.vertices.push(processedData);
                } else if (pattern.handler === this.processNormal) {
                    object.normals.push(processedData);
                } else if (pattern.handler === this.processTexCoord) {
                    object.texture.push(processedData);
                } else if (pattern.handler === this.processFace) {
                    object.vertexIndices.push(...processedData.vertexIndices);
                    object.normalIndices.push(...processedData.normalIndices);
                    object.textureIndices.push(...processedData.textureIndices);
                }
                break;
            }
        }
    }

    private static processFace(line: string): ProcessedFace {

        const face = this.faceStringTofaceNumber(line);

        const verticeIndices: number[] = [];
        const normalIndices: number[] = [];
        const uvIndices: number[] = [];

        face.forEach(coords => {
            verticeIndices.push(coords.v);
            normalIndices.push(coords.n);
            uvIndices.push(coords.t);
        });

        return {
            vertexIndices: this.triangulate(verticeIndices),
            normalIndices: this.triangulate(normalIndices),
            textureIndices: this.triangulate(uvIndices)
        }
    }
    
    private static faceStringTofaceNumber(face: string) {
        const parts = face.split(/\s+/);

        const result: verticeNormalTexture[] = parts.map(part => {
            const indices = part.split('/').map(index => index ? parseInt(index, 10) - 1 : null);
            return {
                v: indices[0], 
                n: indices[1], 
                t: indices[2] 
            };
        });

        return result;
    }

    private static processVertex(vertexLine: string): Vec3 | null {
        const parts = vertexLine.trim().split(/\s+/);
    
        if (parts.length !== 3) {
            console.error(`Formato inválido para vértice: "${vertexLine}". Esperado: 3 coordenadas.`);
            return null;
        }
    
        const [x, y, z] = parts.map(part => {
            const value = parseFloat(part);
            if (isNaN(value)) {
                console.error(`Valor inválido encontrado: "${part}". Deve ser um número.`);
                return 0; 
            }
            return value;
        });
 
        return new Vec3(x, y, z);
    }

    private static processNormal(normalLine: string): Vec3 | null {
        const parts = normalLine.trim().split(/\s+/);
    
        if (parts.length !== 3) {
            console.error(`Formato inválido para normal: "${normalLine}". Esperado: 3 coordenadas.`);
            return null;
        }
    
        const [x, y, z] = parts.map(part => {
            const value = parseFloat(part);
            if (isNaN(value)) {
                console.error(`Valor inválido encontrado na normal: "${part}". Deve ser um número.`);
                return 0;
            }
            return value;
        });
    
        return new Vec3(x, y, z);
    }
    
    private static processTexCoord(texCoordLine: string): Vec2 | null {
        const parts = texCoordLine.trim().split(/\s+/);
    
        if (parts.length !== 2) {
            console.error(`Formato inválido para coordenada de textura: "${texCoordLine}". Esperado: 2 coordenadas.`);
            return null;
        }
    
        const [u, v] = parts.map(part => {
            const value = parseFloat(part);
            if (isNaN(value)) {
                console.error(`Valor inválido encontrado nas coordenadas de textura: "${part}". Deve ser um número.`);
                return 0;
            }
            return value;
        });
    
        return new Vec2(u, v);
    }

    private static triangulate(indices: number[]): number[] {
        if (indices.length === 3) {
            return indices;
        }
    
        const triangles: number[] = [];
    
        const baseIndex = indices[0];
        for (let i = 1; i < indices.length - 1; i++) {
            triangles.push(baseIndex, indices[i], indices[i + 1]);
        }
    
        return triangles;
    }
}

interface ProcessedFace {
    normalIndices: number[];
    vertexIndices: number[];
    textureIndices: number[];
}

interface verticeNormalTexture {v: number, n: number, t: number}


















// public static parseMTL(text: string): Map<string, ObjMaterial> {
//     const materials = new Map<string, ObjMaterial>();
//     let currentMaterial: ObjMaterial | null = null;

//     const lines = text.trim().split('\n');
//     const materialRE = /^newmtl\s+(.+)$/;
//     const kaRE = /^Ka\s+(\d+\.?\d*)\s+(\d+\.?\d*)\s+(\d+\.?\d*)$/;
//     const kdRE = /^Kd\s+(\d+\.?\d*)\s+(\d+\.?\d*)\s+(\d+\.?\d*)$/;
//     const ksRE = /^Ks\s+(\d+\.?\d*)\s+(\d+\.?\d*)\s+(\d+\.?\d*)$/;
//     const nsRE = /^Ns\s+(\d+)$/;
//     const dRE = /^d\s+(\d+\.?\d*)$/;
//     const mapKdRE = /^map_Kd\s+(.+)$/;

//     for (const line of lines) {
//         const trimmedLine = line.trim();
//         const materialMatch = trimmedLine.match(materialRE);
//         if (materialMatch) {
//             if (currentMaterial) {
//                 materials.set(currentMaterial.name, currentMaterial);
//             }
//             currentMaterial = new ObjMaterial(materialMatch[1]);
//         } else if (currentMaterial) {
//             const kaMatch = trimmedLine.match(kaRE);
//             if (kaMatch) {
//                 currentMaterial.Ka = new Vec3(
//                     parseFloat(kaMatch[1]),
//                     parseFloat(kaMatch[2]),
//                     parseFloat(kaMatch[3])
//                 );
//             }
//             const kdMatch = trimmedLine.match(kdRE);
//             if (kdMatch) {
//                 currentMaterial.Kd = new Vec3(
//                     parseFloat(kdMatch[1]),
//                     parseFloat(kdMatch[2]),
//                     parseFloat(kdMatch[3])
//                 );
//             }
//             const ksMatch = trimmedLine.match(ksRE);
//             if (ksMatch) {
//                 currentMaterial.Ks = new Vec3(
//                     parseFloat(ksMatch[1]),
//                     parseFloat(ksMatch[2]),
//                     parseFloat(ksMatch[3])
//                 );
//             }
//             const nsMatch = trimmedLine.match(nsRE);
//             if (nsMatch) {
//                 currentMaterial.Ns = parseFloat(nsMatch[1]);
//             }
//             const dMatch = trimmedLine.match(dRE);
//             if (dMatch) {
//                 currentMaterial.d = parseFloat(dMatch[1]);
//             }
//             const mapKdMatch = trimmedLine.match(mapKdRE);
//             if (mapKdMatch) {
//                 currentMaterial.mapKd = mapKdMatch[1];
//             }
//         }
//     }

//     if (currentMaterial) {
//         materials.set(currentMaterial.name, currentMaterial);
//     }

//     return materials;
// }
