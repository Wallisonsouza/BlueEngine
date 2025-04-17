import Entity from "../../components/Entity";
import { BufferDataType, getType } from "../../enum/BufferDataType";
import Vector2 from "../../math/Vector2";
import Vector3 from "../../math/Vector3";

export default class Mesh extends Entity {
    public name: string = "new mesh";
    public vertices: Vector3[] | null = null;
    public normals: Vector3[] | null = null;
    public uvs: Vector2[] | null = null;
    public tangents: Vector3[] | null = null;
    public bitangents: Vector3[] | null = null;
    private _triangles: number[];
    public wireframeTriangles: number[] | null = null;

    private _indexDataType: BufferDataType = BufferDataType.UNSIGNED_BYTE;

    public get triangles() {

        if(!this._triangles || this._triangles.length < 3) {
            console.warn()
        }
        return this._triangles;
    }
    public get indexDataType() {
        return this._indexDataType;
    }

    public set triangles(value: number[]) {
        if(value && value.length) {
            this._triangles = value;
            this._indexDataType = getType(value);
        }
    }

    constructor(
        vertices: Vector3[], 
        triangles: number[],
        normals: Vector3[] | null = null, 
        uvs: Vector2[] | null = null,
        tangents: Vector3[] | null = null,
        bitangents: Vector3[] | null = null,  
    ) {
        super();
        this.vertices = vertices;
        this._triangles = triangles;
        this.normals = normals;
        this.uvs = uvs;
        this.tangents = tangents;
        this.bitangents = bitangents;

        this._indexDataType = getType(triangles);

        if(!this.tangents) {
            this.recalculateTangents();
        }

        this.wireframeTriangles = this.generateWireframe(triangles, vertices);
    }
   
    // private calculateFaceNormals(vertices: Vector3[], triangles: number[]): Vector3[] {
    //     const faceNormals: Vector3[] = [];

    //     for (let i = 0; i < triangles.length; i += 3) {
    //         if (triangles[i] >= vertices.length || triangles[i + 1] >= vertices.length || triangles[i + 2] >= vertices.length) {
    //             console.error(`Invalid triangle index: ${triangles[i]}, ${triangles[i + 1]}, ${triangles[i + 2]}`);
    //             throw new Error("Index out of range in triangles.");
    //         }

    //         const v0 = vertices[triangles[i]];
    //         const v1 = vertices[triangles[i + 1]];
    //         const v2 = vertices[triangles[i + 2]];

    //         const u = v1.subtract(v0);
    //         const v = v2.subtract(v0);
    //         faceNormals.push(u.cross(v).normalize());
    //     }

    //     return faceNormals;
    // }

    // private calculateVertexNormalsWithArea(vertices: Vector3[], triangles: number[], faceNormals: Vector3[]): void {
    //     for (let i = 0; i < triangles.length; i += 3) {
    //         const v0 = triangles[i];
    //         const v1 = triangles[i + 1];
    //         const v2 = triangles[i + 2];

    //         const edge1 = vertices[v1].subtract(vertices[v0]);
    //         const edge2 = vertices[v2].subtract(vertices[v0]);
    //         const area = edge1.cross(edge2).length() * 0.5;

    //         const normal = faceNormals[i / 3];

    //         this.normals[v0] = this.normals[v0].add(normal.scale(area));
    //         this.normals[v1] = this.normals[v1].add(normal.scale(area));
    //         this.normals[v2] = this.normals[v2].add(normal.scale(area));
    //     }

    //     this.normals = this.normals.map(n => n.normalize());
    // }

    // recalculateNormals(): void {
    //     const faceNormals = this.calculateFaceNormals(this.vertices, this.triangles);
    //     this.calculateVertexNormalsWithArea(this.vertices, this.triangles, faceNormals);
    // }

    recalculateTangents(): void {

        if (
            (this.vertices && this.vertices.length >= 3) && 
            (this.triangles && this.triangles.length >= 3) && 
            (this.uvs && this.uvs.length >= 3)
        ) {
          
            this.tangents = Array.from({ length: this.vertices.length }, () => new Vector3(0, 0, 0));
            this.bitangents = Array.from({ length: this.vertices.length }, () => new Vector3());
    
            for (let i = 0; i < this.triangles.length; i += 3) {
                const i0 = this.triangles[i];
                const i1 = this.triangles[i + 1];
                const i2 = this.triangles[i + 2];
    
                const v0 = this.vertices[i0];
                const v1 = this.vertices[i1];
                const v2 = this.vertices[i2];
    
                const uv0 = this.uvs[i0];
                const uv1 = this.uvs[i1];
                const uv2 = this.uvs[i2];
    
                const edge1 = v1.subtract(v0);
                const edge2 = v2.subtract(v0);
    
                const deltaUV1 = uv1.subtract(uv0);
                const deltaUV2 = uv2.subtract(uv0);
    
                const det = deltaUV1.x * deltaUV2.y - deltaUV1.y * deltaUV2.x;
    
                if (det === 0) {
                    console.warn("Zero determinant, skipping tangent calculation for triangle.");
                    continue;
                }
    
                const f = 1.0 / det;
                const tangent = edge1.scale(deltaUV2.y).subtract(edge2.scale(deltaUV1.y)).scale(f);
               
    
                this.tangents[i0] = this.tangents[i0].add(tangent);
                this.tangents[i1] = this.tangents[i1].add(tangent);
                this.tangents[i2] = this.tangents[i2].add(tangent);

                const bitangent = edge2.scale(deltaUV1.x).subtract(edge1.scale(deltaUV2.x)).scale(f);
                this.bitangents[i0] = this.bitangents[i0].add(bitangent);
                this.bitangents[i1] = this.bitangents[i1].add(bitangent);
                this.bitangents[i2] = this.bitangents[i2].add(bitangent);
            }
    
            this.tangents = this.tangents.map(t => t.normalize());
            this.bitangents = this.bitangents.map(b => b.normalize());
        }
    }
    
    private generateWireframe(indices: number[], vertices: Vector3[]): number[] {
        const edges = new Set<string>();
        const wireframeIndices: number[] = [];
    
        const addEdge = (i1: number, i2: number) => {
            // Cria uma chave única para a aresta, independentemente da ordem dos índices
            const min = Math.min(i1, i2);
            const max = Math.max(i1, i2);
            const key = `${min}_${max}`;
    
            if (!edges.has(key)) {
                edges.add(key);
                wireframeIndices.push(i1, i2);
            }
        };
    
        for (let i = 0; i < indices.length; i += 3) {
            const i0 = indices[i];
            const i1 = indices[i + 1];
            const i2 = indices[i + 2];
    
            addEdge(i0, i1);
            addEdge(i1, i2);
            addEdge(i2, i0);
        }
    
        return wireframeIndices;
    }
    
    
    
 
}


 