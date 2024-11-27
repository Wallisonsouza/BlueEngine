import Object from "../../components/Object";


export default class Mesh extends Object {

    vertices:Float32Array | null = null;
    triangles: Uint16Array | Uint32Array | null = null;
    normals:Float32Array | null = null;
    uvs: Float32Array | null = null;
    tangents: Float32Array | null = null;
    bitangents: Float32Array | null = null;

    constructor(vertices?:Float32Array, normals?:Float32Array, uvs?: Float32Array, triangles?: Uint16Array | Uint32Array) {
        super();
        this.vertices = vertices || null;
        this.triangles = triangles || null;
        this.normals = normals || null;
        this.uvs = uvs || null;
        this.recalculateTangents();
    }

    public translateVertices(translation: [number, number, number]): void {
        if (!this.vertices) {
            console.warn("Vertices are not defined.");
            return;
        }
    
        // Itera sobre os vértices em grupos de 3 (x, y, z)
        for (let i = 0; i < this.vertices.length; i += 3) {
            this.vertices[i] -= translation[0];     // Translada o valor x
            this.vertices[i + 1] -= translation[1]; // Translada o valor y
            this.vertices[i + 2] -= translation[2]; // Translada o valor z
        }
    }
    
    recalculateNormals() {
        if (!this.vertices || !this.triangles) {
            console.warn("Vertices or triangles are not defined.");
            return;
        }

        const vertexCount = this.vertices.length / 3; // Assuming 3 floats per vertex (x, y, z)
        this.normals = new Float32Array(vertexCount * 3); // Initialize normals array

        // Reset normals to zero
        for (let i = 0; i < this.normals.length; i++) {
            this.normals[i] = 0;
        }

        // Calculate normals for each triangle
        for (let i = 0; i < this.triangles.length; i += 3) {
            const index0 = this.triangles[i] * 3; // Index of the first vertex
            const index1 = this.triangles[i + 1] * 3; // Index of the second vertex
            const index2 = this.triangles[i + 2] * 3; // Index of the third vertex

            // Get vertices
            const v0 = [this.vertices[index0], this.vertices[index0 + 1], this.vertices[index0 + 2]];
            const v1 = [this.vertices[index1], this.vertices[index1 + 1], this.vertices[index1 + 2]];
            const v2 = [this.vertices[index2], this.vertices[index2 + 1], this.vertices[index2 + 2]];

            // Calculate the normal using the cross product
            const normal = this.calculateNormal(v0, v1, v2);

            // Accumulate normals for each vertex of the triangle
            this.normals[index0] += normal[0];
            this.normals[index0 + 1] += normal[1];
            this.normals[index0 + 2] += normal[2];

            this.normals[index1] += normal[0];
            this.normals[index1 + 1] += normal[1];
            this.normals[index1 + 2] += normal[2];

            this.normals[index2] += normal[0];
            this.normals[index2 + 1] += normal[1];
            this.normals[index2 + 2] += normal[2];
        }

        // Normalize the normals
        for (let i = 0; i < vertexCount; i++) {
            const index = i * 3;
            const length = Math.sqrt(
                this.normals[index] ** 2 +
                this.normals[index + 1] ** 2 +
                this.normals[index + 2] ** 2
            );

            if (length > 0) {
                this.normals[index] /= length;
                this.normals[index + 1] /= length;
                this.normals[index + 2] /= length;
            }
        }
    }
    recalculateTangents() {
        if (!this.vertices || !this.uvs || !this.triangles) {
            console.warn("Vertices, UVs, or triangles are not defined.");
            return;
        }
    
        const vertexCount = this.vertices.length / 3;
        this.tangents = new Float32Array(vertexCount * 3);
        this.bitangents = new Float32Array(vertexCount * 3);
    
        // Inicializa tangentes e bitangentes com zero
        for (let i = 0; i < this.tangents.length; i++) {
            this.tangents[i] = 0;
            this.bitangents[i] = 0;
        }
    
        // Itera pelos triângulos
        for (let i = 0; i < this.triangles.length; i += 3) {
            const i0 = this.triangles[i] * 3;
            const i1 = this.triangles[i + 1] * 3;
            const i2 = this.triangles[i + 2] * 3;
    
            // Vértices
            const v0 = [this.vertices[i0], this.vertices[i0 + 1], this.vertices[i0 + 2]];
            const v1 = [this.vertices[i1], this.vertices[i1 + 1], this.vertices[i1 + 2]];
            const v2 = [this.vertices[i2], this.vertices[i2 + 1], this.vertices[i2 + 2]];
    
            // Coordenadas UV
            const uv0 = [this.uvs[i0 / 3 * 2], this.uvs[i0 / 3 * 2 + 1]];
            const uv1 = [this.uvs[i1 / 3 * 2], this.uvs[i1 / 3 * 2 + 1]];
            const uv2 = [this.uvs[i2 / 3 * 2], this.uvs[i2 / 3 * 2 + 1]];
    
            // Calcula os vetores de borda
            const edge1 = [
                v1[0] - v0[0],
                v1[1] - v0[1],
                v1[2] - v0[2]
            ];
            const edge2 = [
                v2[0] - v0[0],
                v2[1] - v0[1],
                v2[2] - v0[2]
            ];
    
            // Diferenças de UV
            const deltaUV1 = [
                uv1[0] - uv0[0],
                uv1[1] - uv0[1]
            ];
            const deltaUV2 = [
                uv2[0] - uv0[0],
                uv2[1] - uv0[1]
            ];
    
            // Determinante
            const det = (deltaUV1[0] * deltaUV2[1] - deltaUV1[1] * deltaUV2[0]);
            const f = det !== 0 ? 1.0 / det : 0.0;
    
            // Calcula tangente e bitangente
            const tangent = [
                f * (deltaUV2[1] * edge1[0] - deltaUV1[1] * edge2[0]),
                f * (deltaUV2[1] * edge1[1] - deltaUV1[1] * edge2[1]),
                f * (deltaUV2[1] * edge1[2] - deltaUV1[1] * edge2[2])
            ];
    
            const bitangent = [
                f * (-deltaUV2[0] * edge1[0] + deltaUV1[0] * edge2[0]),
                f * (-deltaUV2[0] * edge1[1] + deltaUV1[0] * edge2[1]),
                f * (-deltaUV2[0] * edge1[2] + deltaUV1[0] * edge2[2])
            ];
    
            // Acumula para os vértices do triângulo
            for (const index of [i0, i1, i2]) {
                this.tangents[index] += tangent[0];
                this.tangents[index + 1] += tangent[1];
                this.tangents[index + 2] += tangent[2];
    
                this.bitangents[index] += bitangent[0];
                this.bitangents[index + 1] += bitangent[1];
                this.bitangents[index + 2] += bitangent[2];
            }
        }
    
        // Normaliza tangentes e bitangentes
        for (let i = 0; i < vertexCount; i++) {
            const tIndex = i * 3;
    
            // Tangente
            const tLength = Math.sqrt(
                this.tangents[tIndex] ** 2 +
                this.tangents[tIndex + 1] ** 2 +
                this.tangents[tIndex + 2] ** 2
            );
            if (tLength > 0) {
                this.tangents[tIndex] /= tLength;
                this.tangents[tIndex + 1] /= tLength;
                this.tangents[tIndex + 2] /= tLength;
            }
    
            // Bitangente
            const bLength = Math.sqrt(
                this.bitangents[tIndex] ** 2 +
                this.bitangents[tIndex + 1] ** 2 +
                this.bitangents[tIndex + 2] ** 2
            );
            if (bLength > 0) {
                this.bitangents[tIndex] /= bLength;
                this.bitangents[tIndex + 1] /= bLength;
                this.bitangents[tIndex + 2] /= bLength;
            }
        }
    }
    
    private calculateNormal(v0: number[], v1: number[], v2: number[]): number[] {
        const edge1 = [v1[0] - v0[0], v1[1] - v0[1], v1[2] - v0[2]];
        const edge2 = [v2[0] - v0[0], v2[1] - v0[1], v2[2] - v0[2]];

        // Cross product
        const normal = [
            edge1[1] * edge2[2] - edge1[2] * edge2[1],
            edge1[2] * edge2[0] - edge1[0] * edge2[2],
            edge1[0] * edge2[1] - edge1[1] * edge2[0]
        ];

        return normal;
    }

    public updateMesh(mesh: Mesh) {
        this.vertices = mesh.vertices;
        this.normals = mesh.normals;
        this.triangles = mesh.triangles;
        this.uvs = mesh.uvs;
        
    }
}  







