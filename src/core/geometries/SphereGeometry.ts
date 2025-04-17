// src/geometries/SphereGeometry.ts

import Mesh from "../graphics/mesh/Mesh";
import Vector2 from "../math/Vector2";
import Vector3 from "../math/Vector3";

export default class SphereGeometry {
    public static create(radius: number = 0.5, latitudes: number  = 64, longitudes: number = 64): Mesh {
        const vertices: Vector3[] = [];
        const normals: Vector3[] = [];
        const uvs: Vector2[] = [];
        const indices: number[] = [];

        this.generateVertices(vertices, normals, uvs, radius, latitudes, longitudes);
        this.generateIndices(indices, latitudes, longitudes);

        return new Mesh(vertices, indices, normals);
    }

    private static generateVertices(
        vertices: Vector3[],
        normals: Vector3[],
        uvs: Vector2[],
        radius: number,
        latitudes: number,
        longitudes: number
    ) {
        for (let lat = 0; lat <= latitudes; lat++) {
            const theta = lat * Math.PI / latitudes;
            const sinTheta = Math.sin(theta);
            const cosTheta = Math.cos(theta);

            const v = lat / latitudes;

            for (let lon = 0; lon <= longitudes; lon++) {
                const phi = lon * 2 * Math.PI / longitudes;
                const sinPhi = Math.sin(phi);
                const cosPhi = Math.cos(phi);

                const u = lon / longitudes;

                const x = radius * cosPhi * sinTheta;
                const y = radius * cosTheta;
                const z = radius * sinPhi * sinTheta;

                vertices.push(new Vector3(x, y, z));
                normals.push(new Vector3(cosPhi * sinTheta, cosTheta, sinPhi * sinTheta));
                uvs.push(new Vector2(u, 1 - v));
            }
        }
    }

    private static generateIndices(
        indices: number[],
        latitudes: number,
        longitudes: number
    ) {
        for (let lat = 0; lat < latitudes; lat++) {
            for (let lon = 0; lon < longitudes; lon++) {
                const first = (lat * (longitudes + 1)) + lon;
                const second = first + longitudes + 1;

                indices.push(first, second, first + 1);
                indices.push(second, second + 1, first + 1);
            }
        }
    }
}
