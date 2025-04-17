import Mesh from "../graphics/mesh/Mesh";
import Vector2 from "../math/Vector2";
import Vector3 from "../math/Vector3";

export default class CubeGeometry {
    public static create(size: Vector3 = new Vector3(1.0, 1.0, 1.0)): Mesh {
        const half = size.scale(0.5);

        const vertices: Vector3[] = [
            // Frente
            new Vector3(-half.x, -half.y, half.z),
            new Vector3(half.x, -half.y, half.z),
            new Vector3(half.x, half.y, half.z),
            new Vector3(-half.x, half.y, half.z),

            // Traseira
            new Vector3(-half.x, -half.y, -half.z),
            new Vector3(half.x, -half.y, -half.z),
            new Vector3(half.x, half.y, -half.z),
            new Vector3(-half.x, half.y, -half.z),

            // Topo
            new Vector3(-half.x, half.y, half.z),
            new Vector3(half.x, half.y, half.z),
            new Vector3(half.x, half.y, -half.z),
            new Vector3(-half.x, half.y, -half.z),

            // Fundo
            new Vector3(-half.x, -half.y, half.z),
            new Vector3(half.x, -half.y, half.z),
            new Vector3(half.x, -half.y, -half.z),
            new Vector3(-half.x, -half.y, -half.z),

            // Esquerda
            new Vector3(-half.x, -half.y, half.z),
            new Vector3(-half.x, -half.y, -half.z),
            new Vector3(-half.x, half.y, -half.z),
            new Vector3(-half.x, half.y, half.z),

            // Direita
            new Vector3(half.x, -half.y, -half.z),
            new Vector3(half.x, -half.y, half.z),
            new Vector3(half.x, half.y, half.z),
            new Vector3(half.x, half.y, -half.z),
        ];

        const normals: Vector3[] = [
            // Frente
            ...[0, 0, 1, 0].map(() => new Vector3(0, 0, 1)),
            // Trás
            ...[0, 0, -1, 0].map(() => new Vector3(0, 0, -1)),
            // Topo
            ...[0, 1, 0, 0].map(() => new Vector3(0, 1, 0)),
            // Fundo
            ...[0, -1, 0, 0].map(() => new Vector3(0, -1, 0)),
            // Esquerda
            ...[-1, 0, 0, 0].map(() => new Vector3(-1, 0, 0)),
            // Direita
            ...[1, 0, 0, 0].map(() => new Vector3(1, 0, 0)),
        ];

        const uvs: Vector2[] = Array(6).flatMap(() => [
            new Vector2(0, 0),
            new Vector2(1, 0),
            new Vector2(1, 1),
            new Vector2(0, 1),
        ]);

        const indices: number[] = [
            0, 2, 1, 0, 3, 2,       // Frente
            4, 6, 5, 4, 7, 6,       // Trás
            8, 10, 9, 8, 11, 10,    // Topo
            12, 14, 13, 12, 15, 14, // Fundo
            16, 18, 17, 16, 19, 18, // Esquerda
            20, 22, 21, 20, 23, 22, // Direita
        ];

        return new Mesh(vertices, indices, normals, uvs);
    }
}
