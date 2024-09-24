export interface Face {
    vertexIndices: number[];
    textureIndices?: number[];
    normalIndices?: number[];
}

export class ObjMesh {

    public static mtllib: string;
    name: string;
    vertices: Vec3[];
    normals: Vec3[];
    texture: Vec2[];
    vertexIndices: number[];
    normalIndices: number[];
    textureIndices: number[];
    faces: Face[] = [];


    constructor(name: string) {
        this.name = name;
        this.vertices = [];
        this.normals = [];
        this.texture = [];
        this.vertexIndices = [];
        this.textureIndices = [];
        this.normalIndices = [];
    }
   
    addVertex(v: Vec3): void {
        this.vertices.push(v);
    }

    addNormal(v: Vec3) {
        this.normals.push(v);
    }

    addTexture(v: Vec2) {
        this.texture.push(v);
    }

    addVertexIndices(v1: number, v2: number, v3: number) {
        this.vertexIndices.push(v1, v2, v3);
    }
   
    public calculateVertexNormals() {
        const vertexNormals: Map<number, Vec3> = new Map();
    
        if (!this.vertexIndices || !this.vertices) {
            console.warn("Os índices de vértices ou vértices estão nulos.");
            return;
        }
    
        // Iterar sobre os índices dos vértices para calcular as normais
        for (let i = 0; i < this.vertexIndices.length; i += 3) {
            const v1Index = this.vertexIndices[i];
            const v2Index = this.vertexIndices[i + 1];
            const v3Index = this.vertexIndices[i + 2];
    
            // Verifique se os índices estão dentro do intervalo
            if (!this.vertices[v1Index] || !this.vertices[v2Index] || !this.vertices[v3Index]) {
                console.warn(`Vértices inválidos nos índices: ${v1Index}, ${v2Index}, ${v3Index}`);
                continue;
            }
    
            const v1 = this.vertices[v1Index];
            const v2 = this.vertices[v2Index];
            const v3 = this.vertices[v3Index];
    
            const edge1 = v2.subtract(v1);
            const edge2 = v3.subtract(v1);
    
            const normal = Vec3.cross(edge1, edge2);
            const area = Vec3.magnitude(normal) * 0.5;
            const weightedNormal = Vec3.scale(normal, area);
    
            [v1Index, v2Index, v3Index].forEach((index) => {
                if (!vertexNormals.has(index)) {
                    vertexNormals.set(index, new Vec3(0, 0, 0));
                }
                const currentNormal = vertexNormals.get(index)!;
                vertexNormals.set(index, Vec3.add(currentNormal, weightedNormal));
            });
        }
    
        // Inicializa o array de normais caso esteja nulo
        if (!this.normals) {
            this.normals = new Array(this.vertices.length).fill(new Vec3(0, 0, 0));
        }
    
        // Normaliza as normais calculadas
        vertexNormals.forEach((normal, index) => {
            const normalized = Vec3.normalize(normal);
            this.normals![index] = normalized; 
        });
    
        // Cria os índices de normais se não existirem
        if (!this.normalIndices) {
            this.normalIndices = [];
        }
    
        // Define os índices de normais com base nos vértices
        for (let i = 0; i < this.vertexIndices.length; i += 3) {
            const v1Index = this.vertexIndices[i];
            const v2Index = this.vertexIndices[i + 1];
            const v3Index = this.vertexIndices[i + 2];
            this.normalIndices.push(v1Index, v2Index, v3Index);
        }
    }
    
    public verticesFloat32(): Float32Array {
        return Vec3.arrayToF32Array(this.vertices);
    }

    public vertexIndicesUint16(): Uint16Array {
        return new Uint16Array(this.vertexIndices);
    }

    public normalsFloat32(): Float32Array {
        return Vec3.arrayToF32Array(this.normals);
    }

    public normalIndicesUint16(): Uint16Array {
        return new Uint16Array(this.normalIndices);
    }

    public textureFloat32(): Float32Array {
        return Vec2.arrayToF32Array(this.texture);
    }

    public textureIndicesUint16(): Uint16Array {
        return new Uint16Array(this.textureIndices);
    }

    public organizeTexture(uvIndices: number[], uvs: Vec2[]): Vec2[] {
        // Crie um novo array para armazenar as UVs organizadas
        const organizedUVs: Vec2[] = [];
    
        // Percorra os índices de UV e reorganize as UVs com base nesses índices
        for (let i = 0; i < uvIndices.length; i++) {
            const uvIndex = uvIndices[i];   // Pega o índice da UV
            organizedUVs.push(uvs[uvIndex]); // Adiciona a UV correspondente ao array organizado
        }
    
        // Retorne as UVs reorganizadas
        return organizedUVs;
    }
}

export class Vec3 {
    constructor(public x: number, public y: number, public z: number) {}

    subtract(vec: Vec3 | undefined): Vec3 {
        if (!vec) {
            throw new Error("O vetor passado para subtract está indefinido.");
        }
        return new Vec3(this.x - vec.x, this.y - vec.y, this.z - vec.z);
    }
    

    static normalize(v: Vec3): Vec3 {
        const length = Math.sqrt(v.x * v.x + v.y * v.y + v.z * v.z);
        return length > 0 ? new Vec3(v.x / length, v.y / length, v.z / length) : new Vec3(0, 0, 0);
    }

    static scale(v: Vec3, scale: number): Vec3 {
        return new Vec3(v.x * scale, v.y * scale, v.z * scale);
    }

    static add(a: Vec3, b: Vec3): Vec3 {
        return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
    }

    static cross(a: Vec3, b: Vec3): Vec3 {
        return new Vec3(
            a.y * b.z - a.z * b.y,
            a.z * b.x - a.x * b.z,
            a.x * b.y - a.y * b.x
        );
    }

    static magnitude(v: Vec3): number {
        return Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
    }

    public static fanTriangulation(vertices: Vec3[]): Vec3[] {
        const triangles: Vec3[] = [];
        
        if (vertices.length < 3) {
            console.error("Fan triangulation requires at least 3 vertices.");
            return triangles;
        }
    
        const baseVertex = vertices[0];
    
        for (let i = 1; i < vertices.length - 1; i++) {
            const v1 = baseVertex;      // Base do triângulo
            const v2 = vertices[i];     // Vértice corrente
            const v3 = vertices[i + 1]; // Próximo vértice
    
            // Adicionar os 3 vértices que formam o triângulo ao array de resultados
            triangles.push(v1, v2, v3);
        }
    
        return triangles;
    }

    public length(){
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    public normalize(epsilon: number = 1e-6): this{
        const length = this.length();
        if (length < epsilon) {
            this.x = 0;
            this.y = 0;
            this.z = 0;
            return this;
        }

        this.x /= length;
        this.y /= length;
        this.z /= length;
        
        return this;
    }

    static arrayToF32Array(v: Vec3[]): Float32Array {
        const floatArray = new Float32Array(v.length * 3);
        v.forEach((vec, index) => {
            floatArray[index * 3] = vec.x;
            floatArray[index * 3 + 1] = vec.y;
            floatArray[index * 3 + 2] = vec.z;
        });
        return floatArray;
    }

    
}

export class Vec2 {

    x: number;
    y: number;

    constructor(x: number, y:number) {
        this.x = x;
        this.y = y;
    }

    
    static arrayToF32Array(v: Vec2[]): Float32Array {
        const floatArray = new Float32Array(v.length * 2);
        v.forEach((vec, index) => {
            floatArray[index * 2] = vec.x;
            floatArray[index * 2 + 1] = vec.y;
        });
        return floatArray;
    }
}

// export class Material {
//     public name: string;
//     public Ka: Vec3; // Cor ambiente
//     public Kd: Vec3; // Cor difusa
//     public Ks: Vec3; // Cor especular
//     public Ns: number; // Exponente de brilho
//     public d: number;  // Opacidade (0.0 a 1.0)
//     public mapKd: string | null; // Textura difusa (caminho do arquivo)
//     public mapKa: string | null; // Textura ambiente
//     public mapKs: string | null; // Textura especular
//     public mapNs: string | null; // Textura de brilho
//     public Ni: number; // Índice de refração
//     public illum: number; // Modelo de iluminação

//     constructor(name: string) {
//         this.name = name;
//         this.Ka = new Vec3(0.2, 0.2, 0.2);
//         this.Kd = new Vec3(0.8, 0.8, 0.8);
//         this.Ks = new Vec3(1.0, 1.0, 1.0);
//         this.Ns = 32; 
//         this.d = 1.0; 
//         this.mapKd = null; 
//         this.mapKa = null; 
//         this.mapKs = null; 
//         this.mapNs = null; 
//         this.Ni = 1.0; // Índice de refração padrão
//         this.illum = 2; // Modelo de iluminação padrão
//     }
// }

// export class Face {
//     public vertexIndices: number[] = [];
//     public textureIndices: number[] = [];
//     public normalIndices: number[] = [];

//     public fanTriangulation(): { vertexIndices: number[], textureIndices: number[], normalIndices: number[] } {
//         const triangulatedVertexIndices: number[] = [];
//         const triangulatedTextureIndices: number[] = [];
//         const triangulatedNormalIndices: number[] = [];

//         if (this.vertexIndices.length < 3) {
//             console.error("A face precisa ter pelo menos 3 vértices para triangularização.");
//             return { vertexIndices: [], textureIndices: [], normalIndices: [] };
//         }

//         const baseVertexIndex = this.vertexIndices[0];

//         for (let i = 1; i < this.vertexIndices.length - 1; i++) {
//             triangulatedVertexIndices.push(baseVertexIndex);
//             triangulatedVertexIndices.push(this.vertexIndices[i]);
//             triangulatedVertexIndices.push(this.vertexIndices[i + 1]);

//             if (this.textureIndices.length > 0) {
//                 triangulatedTextureIndices.push(this.textureIndices[0]);
//                 triangulatedTextureIndices.push(this.textureIndices[i]);
//                 triangulatedTextureIndices.push(this.textureIndices[i + 1]);
//             }

//             if (this.normalIndices.length > 0) {
//                 triangulatedNormalIndices.push(this.normalIndices[0]);
//                 triangulatedNormalIndices.push(this.normalIndices[i]);
//                 triangulatedNormalIndices.push(this.normalIndices[i + 1]);
//             }
//         }

//         return {
//             vertexIndices: triangulatedVertexIndices,
//             textureIndices: triangulatedTextureIndices,
//             normalIndices: triangulatedNormalIndices
//         };
//     }

//     public static fanTriangulation(faces: Face[]): {
//         vertexIndices: number[],
//         textureIndices: number[],
//         normalIndices: number[]
//     } {
//         const allVertexIndices: number[] = [];
//         const allTextureIndices: number[] = [];
//         const allNormalIndices: number[] = [];
    
//         faces.forEach(face => {
//             const triangulated = face.fanTriangulation();
            
//             allVertexIndices.push(...triangulated.vertexIndices);
//             allTextureIndices.push(...triangulated.textureIndices);
//             allNormalIndices.push(...triangulated.normalIndices);
//         });
    
//         return {
//             vertexIndices: allVertexIndices,
//             textureIndices: allTextureIndices,
//             normalIndices: allNormalIndices
//         };
//     }
    
// }
