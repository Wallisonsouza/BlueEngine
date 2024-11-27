import Vector2 from "../../engine_modules/module_vectors/Vector2";
import Vector3 from "../../engine_modules/module_vectors/Vector3";
import { Face, ObjMesh } from "./ObjRepresentation";

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

    private static processVertex(v: string[]): Vector3[] {
        const vertices: Vector3[] = [];
        for (const vertex of v) {
            const coords = vertex.slice(2).trim().split(' ').map(Number);
            if (coords.length === 3) {
                vertices.push(new Vector3(coords[0], coords[1], coords[2]));
            } else {
                console.warn(`Vertex data is invalid: ${vertex}`);
            }
        }
        return vertices;
    }

    private static processNormal(vn: string[]): Vector3[] {
        const normals: Vector3[] = [];
        for (const normal of vn) {
            const coords = normal.slice(3).trim().split(' ').map(Number);
            if (coords.length === 3) {
                normals.push(new Vector3(coords[0], coords[1], coords[2]));
            } else {
                console.warn(`Normal data is invalid: ${normal}`);
            }
        }
        return normals;
    }

    private static processTexture(vt: string[]): Vector2[] {
        const textures: Vector2[] = [];
        for (const texture of vt) {
            const coords = texture.slice(3).trim().split(' ').map(Number);
            if (coords.length === 2) {
                // Normalizar coordenadas UV para estar entre 0 e 1
                const u = coords[0] < 0 ? 0 : coords[0] > 1 ? 1 : coords[0];
                const v = coords[1] < 0 ? 0 : coords[1] > 1 ? 1 : coords[1];
                textures.push(new Vector2(u, v));
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

    static process(value: string) {
        const data = this.preProcessObjFormat(value);

        const objMesh = new ObjMesh("a");
       
        objMesh.vertices = this.processVertex(data.v);
        objMesh.normals = this.processNormal(data.vn);
        objMesh.uvs = this.processTexture(data.vt);

        const face = this.processFace(data.f);
        const triangles = this.triangulate(face);
        objMesh.triangles.vertices = triangles.vertexTriangles;
        objMesh.triangles.uvs = triangles.textureTriangles;
        objMesh.calculateVertexNormals();
      
        return objMesh;
    }
}