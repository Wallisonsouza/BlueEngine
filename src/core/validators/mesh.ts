import Mesh from "../graphics/mesh/Mesh";

export default class MeshValidator {

    public static validate(mesh: Mesh | null): Mesh | null {

        if (!mesh) {
            console.warn("Mesh não encontrada. Verifique a malha.");
            return null;
        }

        if (!mesh.triangles || mesh.triangles.length < 3) {
            console.warn("A malha não possui triângulos definidos.");
            return null;
        }

        if (!mesh.vertices || mesh.vertices.length === 3) {
            console.warn("A malha não possui vértices definidos.");
            return null;
        }

        return mesh;
    }
}
