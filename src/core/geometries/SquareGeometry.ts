import Mesh from "../graphics/mesh/Mesh";
import Vector2 from "../math/Vector2";
import Vector3 from "../math/Vector3";

export default class SquareGeometry {
    public static create(size: Vector3 = new Vector3(1, 1, 1)): Mesh {
        const halfSize = size.scale(0.5);

        const vertices: Vector3[] = [
            new Vector3(-halfSize.x, -halfSize.y, 0),
            new Vector3( halfSize.x, -halfSize.y, 0),
            new Vector3(-halfSize.x,  halfSize.y, 0),
            new Vector3( halfSize.x,  halfSize.y, 0),
        ];

        const normals: Vector3[] = [
            new Vector3(0, 0, 1),
            new Vector3(0, 0, 1),
            new Vector3(0, 0, 1),
            new Vector3(0, 0, 1),
        ];

        const uvs: Vector2[] = [
            new Vector2(0, 0),
            new Vector2(1, 0),
            new Vector2(0, 1),
            new Vector2(1, 1),
        ];

        const indices: number[] = [
            0, 1, 2,
            2, 1, 3
        ];

        const mesh =  new Mesh(vertices, indices, normals, uvs);
        mesh.wireframeTriangles = [

        ]
        return mesh
    }
}
