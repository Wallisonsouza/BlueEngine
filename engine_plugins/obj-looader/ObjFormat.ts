// import { ObjMesh, Vec2, Vec3 } from "./ObjRepresentation";

// interface ObjData {
//     name: string;
//     v: string[];
//     vn: string[];
//     vt: string[];
//     f: string[];
// }

// interface Face {
//     vertexIndices: number[];
//     textureIndices?: number[];
//     normalIndices?: number[];
// }

// export default class ObjFormart {

//     private static preProcessObjFormat(text: string): ObjData[] {
//         const lines = text.trim().split('\n');
//         const objData: ObjData[] = [];
//         let currentObjectName = '';
//         let currentObjectData: ObjData = { name: '', v: [], vn: [], vt: [], f: [] };
//         for (const line of lines) {
//             const trimmedLine = line.trim();
//             if (trimmedLine.startsWith('#')) continue;

//             if (trimmedLine.startsWith('o ')) {
//                 if (currentObjectName) objData.push(currentObjectData);
//                 currentObjectName = trimmedLine.slice(2); 
//                 currentObjectData = { name: currentObjectName, v: [], vn: [], vt: [], f: [] };
            
//             } else if (trimmedLine.startsWith('v ')) {
//                 currentObjectData.v.push(trimmedLine);
//             } else if (trimmedLine.startsWith('vn ')) {
//                 currentObjectData.vn.push(trimmedLine);
//             } else if (trimmedLine.startsWith('vt ')) {
//                 currentObjectData.vt.push(trimmedLine);
//             } else if (trimmedLine.startsWith('f ')) {
//                 currentObjectData.f.push(trimmedLine);
//             }
//         }

//         if (currentObjectName) objData.push(currentObjectData);
//         return objData;
//     }

//     private static processVertex(v: string[]): Vec3[] {
//         const vertices: Vec3[] = [];
//         for (const vertex of v) {
//             const coords = vertex.slice(2).trim().split(' ').map(Number);
//             if (coords.length === 3) {
//                 vertices.push(new Vec3(coords[0], coords[1], coords[2]));
//             } else {
//                 console.warn(`Vertex data is invalid: ${vertex}`);
//             }
//         }
//         return vertices;
//     }

//     private static processNormal(vn: string[]): Vec3[] {
//         const normals: Vec3[] = [];
//         for (const normal of vn) {
//             const coords = normal.slice(3).trim().split(' ').map(Number);
//             if (coords.length === 3) {
//                 normals.push(new Vec3(coords[0], coords[1], coords[2]));
//             } else {
//                 console.warn(`Normal data is invalid: ${normal}`);
//             }
//         }
//         return normals;
//     }

//     private static processTexture(vt: string[]): Vec2[] {
//         const textures: Vec2[] = [];
//         for (const texture of vt) {
//             const coords = texture.slice(3).trim().split(' ').map(Number);
//             if (coords.length === 2) {
//                 textures.push(new Vec2(coords[0], coords[1]));
//             } else {
//                 console.warn(`Texture data is invalid: ${texture}`);
//             }
//         }
//         return textures;
//     }

//     private static processFace(face: string[], vertexDecrement: number = 0): Face[] {
//         const faces: Face[] = [];
//         for (const f of face) {
//             const parts = f.slice(2).trim().split(' ');

//             const vertexIndices: number[] = [];
//             const textureIndices: number[] = [];
//             const normalIndices: number[] = [];
//             const dec = (1 + vertexDecrement) || 1;
//             for (const part of parts) {
//                 const indices = part.split('/').map(Number);
//                 vertexIndices.push((indices[0] - dec));
//                 if (indices.length > 1 && !isNaN(indices[1])) {
//                     textureIndices.push((indices[1]));
//                 }
//             }
//             faces.push({
//                 vertexIndices,
//                 textureIndices: textureIndices.length ? textureIndices : undefined,
//                 normalIndices: normalIndices.length ? normalIndices : undefined,
//             });
//         }
//         return faces;
//     }

//     private static triangulate(faces: Face[]) {
//         const result: {vertexTriangles: number[], textureTriangles: number[]} = {textureTriangles:[], vertexTriangles: []};
//         faces.forEach(face => {
//             const vI = face.vertexIndices;
//             const vtI = face.textureIndices;

//             if (vI.length === 3) {
//                 result.vertexTriangles.push(...vI);
//             } else {
//                 const baseIndex = vI[0];
//                 for (let i = 1; i < vI.length - 1; i++) {
//                     result.vertexTriangles.push(baseIndex, vI[i], vI[i + 1]);
//                 }
//             }

//             if (vtI.length === 3) {
//                 result.textureTriangles.push(...vtI);
//             } else {
//                 const baseIndex = vtI[0];
//                 for (let i = 1; i < vtI.length - 1; i++) {
//                     result.textureTriangles.push(baseIndex, vtI[i], vtI[i + 1]);
//                 }
//             }
//         });

//         return result;
//     }

//     static vertCount = 0;
//     static currentObjectMesh: ObjMesh | null = null;

//     static process(data: string) {
//         const datas = this.preProcessObjFormat(data);
//         const meshs: ObjMesh[] = [];

//         datas.forEach(data => {
//             const objMesh = new ObjMesh(data.name);
            
//             if(this.currentObjectMesh){
//                 this.vertCount += this.currentObjectMesh.vertices.length;
//             }
       
//             objMesh.vertices = this.processVertex(data.v);
//             objMesh.normals = this.processNormal(data.vn);
//             objMesh.texture = this.processTexture(data.vt);

//             const face = this.processFace(data.f, this.vertCount);
//             const triangles = this.triangulate(face);
//             objMesh.vertexIndices = triangles.vertexTriangles;
//             objMesh.textureIndices = triangles.textureTriangles;

//             console.log(triangles.textureTriangles);

//             this.currentObjectMesh = objMesh;
//             objMesh.calculateVertexNormals();
//             meshs.push(objMesh);
            
//         });
        
//         return meshs;
//     }
// }


import { Face, ObjMesh, Vec2, Vec3 } from "./ObjRepresentation";

interface ObjData {
    name: string;
    v: string[];
    vn: string[];
    vt: string[];
    vI: string[];
    vnI: string[];
    vtI: string[];
    f: string[];
}

export default class ObjFormart {

    private static preProcessObjFormat(text: string): ObjData {
        const lines = text.trim().split('\n');
        const objData: ObjData = {
            name: "",
            f: [],
            v: [],
            vn: [],
            vt: [],
            vI: [],
            vnI: [],
            vtI: []
        };
       
        for (const line of lines) {
            const trimmedLine = line.trim();
            if (trimmedLine.startsWith('#')) continue;

            if (trimmedLine.startsWith('v ')) {
                objData.v.push(trimmedLine);
            } else if (trimmedLine.startsWith('vn ')) {
                objData.vn.push(trimmedLine);
            } else if (trimmedLine.startsWith('vt ')) {
                objData.vt.push(trimmedLine);
            }  else if (trimmedLine.startsWith('f ')) {
                objData.f.push(trimmedLine);
            }
        }
        
        return objData;
    }

    private static processVertex(v: string[]): Vec3[] {
        const vertices: Vec3[] = [];
        for (const vertex of v) {
            const coords = vertex.slice(2).trim().split(' ').map(Number);
            if (coords.length === 3) {
                vertices.push(new Vec3(coords[0], coords[1], coords[2]));
            } else {
                console.warn(`Vertex data is invalid: ${vertex}`);
            }
        }
        return vertices;
    }

    private static processNormal(vn: string[]): Vec3[] {
        const normals: Vec3[] = [];
        for (const normal of vn) {
            const coords = normal.slice(3).trim().split(' ').map(Number);
            if (coords.length === 3) {
                normals.push(new Vec3(coords[0], coords[1], coords[2]));
            } else {
                console.warn(`Normal data is invalid: ${normal}`);
            }
        }
        return normals;
    }

    private static processTexture(vt: string[]): Vec2[] {
        const textures: Vec2[] = [];
        for (const texture of vt) {
            const coords = texture.slice(3).trim().split(' ').map(Number);
            if (coords.length === 2) {
                // Normalizar coordenadas UV para estar entre 0 e 1
                const u = coords[0] < 0 ? 0 : coords[0] > 1 ? 1 : coords[0];
                const v = coords[1] < 0 ? 0 : coords[1] > 1 ? 1 : coords[1];
                textures.push(new Vec2(u, v));
            } else {
                console.warn(`Texture data is invalid: ${texture}`);
            }
        }
        return textures;
    }

    private static processFace(face: string[]): Face[] {
        const faces: Face[] = [];
        for (const f of face) {
            const parts = f.slice(2).trim().split(' ');

            const vertexIndices: number[] = [];
            const textureIndices: number[] = [];
            const normalIndices: number[] = [];
            
            for (const part of parts) {
                const indices = part.split('/').map(Number);
                vertexIndices.push(indices[0] - 1);  // Indices de vértice
                if (indices.length > 1 && !isNaN(indices[1])) {
                    textureIndices.push(indices[1] - 1); // Indices de textura
                }
                if (indices.length > 2 && !isNaN(indices[2])) {
                    normalIndices.push(indices[2] - 1);  // Indices de normais
                }
            }
            faces.push({
                vertexIndices,
                textureIndices: textureIndices.length ? textureIndices : undefined,
                normalIndices: normalIndices.length ? normalIndices : undefined,
            });
        }
        return faces;
    }

    private static triangulate(faces: Face[]) {
        const result: { vertexTriangles: number[], textureTriangles: number[] } = {
            vertexTriangles: [],
            textureTriangles: []
        };
    
        faces.forEach(face => {
            const vI = face.vertexIndices;
            const vtI = face.textureIndices;
    
            if (vI.length >= 3) {
                // Triangularização das faces
                for (let i = 1; i < vI.length - 1; i++) {
                    result.vertexTriangles.push(vI[0], vI[i], vI[i + 1]);
    
                    // Se as UVs existirem e o comprimento for suficiente, triangule-as também
                    if (vtI && vtI.length >= vI.length) {
                        result.textureTriangles.push(vtI[0], vtI[i], vtI[i + 1]);
                    } else {
                        console.warn(`UV indices insuficientes para a face. Adicionando UV padrão.`);
                        // Aqui você pode adicionar uma UV padrão, se necessário
                    }
                }
            }
        });
    
        return result;
    }
    
    private static organizeTexture(uvIndices: number[], uvs: Vec2[]): Vec2[] {
        const organizedUVs: Vec2[] = [];
        const uniqueUVs = new Map<number, Vec2>();
    
        // Reorganizar com base nos índices
        for (const uvIndex of uvIndices) {
            // Verificação do intervalo dos índices
            if (uvIndex < 0 || uvIndex >= uvs.length) {
                console.warn(`UV index ${uvIndex} está fora do intervalo. Adicionando UV padrão.`);
                organizedUVs.push(new Vec2(0, 0)); // Adicionar UV padrão se o índice for inválido
            } else {
                // Adiciona a UV correspondente se ainda não estiver no map
                if (!uniqueUVs.has(uvIndex)) {
                    uniqueUVs.set(uvIndex, uvs[uvIndex]);
                }
                organizedUVs.push(uniqueUVs.get(uvIndex)!); // Adiciona a UV correspondente do map
            }
        }
    
        return organizedUVs;
    }
    
    
    

    static process(value: string) {
        const data = this.preProcessObjFormat(value);

        const objMesh = new ObjMesh("a");
       
        objMesh.vertices = this.processVertex(data.v);
        objMesh.normals = this.processNormal(data.vn);
        const textureCoords = this.processTexture(data.vt);

        const face = this.processFace(data.f);
        const triangles = this.triangulate(face);
        objMesh.vertexIndices = triangles.vertexTriangles;
        const textureIndices = triangles.textureTriangles;
        objMesh.texture = this.organizeTexture(textureIndices, textureCoords);
        objMesh.calculateVertexNormals();
      
        return objMesh;
    }
}