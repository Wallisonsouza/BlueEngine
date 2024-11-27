import Vector2 from "../../engine_modules/module_vectors/Vector2";
import Vector3 from "../../engine_modules/module_vectors/Vector3";

export interface Face {
    vertexIndices: number[];
    textureIndices?: number[];
    normalIndices?: number[];
}

export interface Triangles {
    vertices: number[];
    normals: number[];
    uvs: number[];
}

export class ObjMesh {
    name: string;
    vertices: Vector3[];
    normals: Vector3[];
    uvs: Vector2[];
    triangles: Triangles;

    constructor(name: string) {
        this.name = name;
        this.vertices = [];
        this.normals = [];
        this.uvs = [];
        this.triangles = { 
            vertices: [], 
            normals: [], 
            uvs: [] 
        };
    }

    addVertex(v: Vector3): void {
        this.vertices.push(v);
    }

    addNormal(v: Vector3): void {
        this.normals.push(v);
    }

    adduv(v: Vector2): void {
        this.uvs.push(v);
    }

    addVertexTriangle(v1: number, v2: number, v3: number): void {
        this.triangles.vertices.push(v1, v2, v3);
    }

    public calculateVertexNormals() {
        const vertexNormals: Map<number, Vector3> = new Map();

        if (!this.triangles.vertices.length || !this.vertices.length) {
            console.warn("Os índices de vértices ou vértices estão nulos.");
            return;
        }

        // Iterar sobre os índices dos vértices para calcular as normais
        for (let i = 0; i < this.triangles.vertices.length; i += 3) {
            const v1Index = this.triangles.vertices[i];
            const v2Index = this.triangles.vertices[i + 1];
            const v3Index = this.triangles.vertices[i + 2];

            if (!this.vertices[v1Index] || !this.vertices[v2Index] || !this.vertices[v3Index]) {
                console.warn(`Vértices inválidos nos índices: ${v1Index}, ${v2Index}, ${v3Index}`);
                continue;
            }

            const v1 = this.vertices[v1Index];
            const v2 = this.vertices[v2Index];
            const v3 = this.vertices[v3Index];

            const edge1 = v2.subtract(v1);
            const edge2 = v3.subtract(v1);

            const normal = Vector3.cross(edge1, edge2);
            const area = Vector3.magnitude(normal) * 0.5;
            const weightedNormal = Vector3.scale(normal, area);

            [v1Index, v2Index, v3Index].forEach((index) => {
                if (!vertexNormals.has(index)) {
                    vertexNormals.set(index, new Vector3(0, 0, 0));
                }
                const currentNormal = vertexNormals.get(index)!;
                vertexNormals.set(index, Vector3.add(currentNormal, weightedNormal));
            });
        }

        // Normaliza e atribui as normais calculadas
        vertexNormals.forEach((normal, index) => {
            const normalized = Vector3.normalize(normal);
            this.normals[index] = normalized;
        });

        // Atualiza os índices de normais
        this.triangles.normals = [...this.triangles.vertices];
    }

    public verticesFloat32(): Float32Array {
        return Vector3.arrayToF32Array(this.vertices);
    }

    public normalsFloat32(): Float32Array {
        return Vector3.arrayToF32Array(this.normals);
    }

    public textureFloat32(): Float32Array {
        return Vector2.arrayToF32Array(this.uvs);
    }
}
