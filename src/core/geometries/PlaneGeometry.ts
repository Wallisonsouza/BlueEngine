import Mesh from "../graphics/mesh/Mesh";
import Vector2 from "../math/Vector2";
import Vector3 from "../math/Vector3";

export default class PlaneGeometry {
    public static create(
        width: number = 100,
        depth: number = 100,
        subdivisionsX: number = 200,
        subdivisionsZ: number = 100
    ): Mesh {
        const vertices: Vector3[] = [];
        const normals: Vector3[] = [];
        const uvs: Vector2[] = [];
        const indices: number[] = [];

        const stepX = width / subdivisionsX;
        const stepZ = depth / subdivisionsZ;

        // Gera vértices, normais e UVs
        for (let z = 0; z <= subdivisionsZ; z++) {
            for (let x = 0; x <= subdivisionsX; x++) {
                const posX = x * stepX - width / 2;
                const posZ = z * stepZ - depth / 2;

                vertices.push(new Vector3(posX, 0, posZ));
                normals.push(new Vector3(0, 1, 0));
                uvs.push(new Vector2(x / subdivisionsX, z / subdivisionsZ));
            }
        }

        // Gera índices
        for (let z = 0; z < subdivisionsZ; z++) {
            for (let x = 0; x < subdivisionsX; x++) {
                const start = z * (subdivisionsX + 1) + x;
                const nextRow = start + subdivisionsX + 1;

                indices.push(start, nextRow, start + 1);
                indices.push(start + 1, nextRow, nextRow + 1);
            }
        }

        return new Mesh(vertices, indices, normals, uvs);
    }
}
