import Ray from "./Ray";
import Mesh from "../graphics/mesh/Mesh";
import Transform from "../components/Transform";
import Quaternion from "../math/Quaternion";
import Vector3 from "../math/Vector3";

export default class RayCast {

    public static meshcast(ray: Ray, mesh: Mesh, transform: Transform): Vector3 | null {
        if (!mesh.triangles || !mesh.vertices) return null;
        
        // Calcula a inversa da rotação uma vez antes do loop
        const invRotation = Quaternion.inverse(transform.rotation);
        const localOrigin = Quaternion.multiplyVector3(invRotation, ray.origin.subtract(transform.position));
        const localDirection = Quaternion.multiplyVector3(invRotation, ray.direction).normalize();

        const vertices = mesh.vertices;
        const triangles = mesh.triangles;

        // Percorre os triângulos
        for (let i = 0; i < triangles.length; i += 3) {
            // Pegando os índices dos vértices do triângulo atual
            const v0Index = triangles[i] * 3;
            const v1Index = triangles[i + 1] * 3;
            const v2Index = triangles[i + 2] * 3;

            // Calculando os vértices diretamente a partir do array de vértices
            const v0 = new Vector3(vertices[v0Index], vertices[v0Index + 1], vertices[v0Index + 2]);
            const v1 = new Vector3(vertices[v1Index], vertices[v1Index + 1], vertices[v1Index + 2]);
            const v2 = new Vector3(vertices[v2Index], vertices[v2Index + 1], vertices[v2Index + 2]);

            // Checando a interseção do raio com o triângulo
            const hit = ray.intersectTriangle(localOrigin, localDirection, v0, v1, v2);

            // Se houver interseção, retorna o ponto no espaço mundial
            if (hit) {
                return Quaternion.multiplyVector3(transform.rotation, hit.point).add(transform.position);
            }
        }

        return null; 
    }

    public static intersectsLine(
            ray: Ray,
            start: Vector3,
            end: Vector3,
            threshold: number = 0.09,
            negative: boolean = false
    ): Vector3 | null {
            const lineDir = end.subtract(start).normalize(); // Direção da linha
            const rayToStart = start.subtract(ray.origin); // Vetor do raio para o início da linha
        
            // Calcula a projeção do início da linha no raio
            const t = ray.direction.dot(rayToStart) / ray.direction.dot(ray.direction);
        
            // Se o valor de t for negativo e interseções negativas não forem permitidas
            if (t < 0 && !negative) return null;
        
            // Calcula o ponto mais próximo no raio
            const closestPoint = ray.origin.add(ray.direction.multiplyScalar(t));
        
            // Verifica se o ponto mais próximo está próximo da linha
            const distanceToLine = Math.abs(closestPoint.subtract(start).dot(lineDir.cross(ray.direction).normalize()));
        
            // Verifica se o ponto mais próximo está dentro do segmento da linha
            const projectionOnLine = closestPoint.subtract(start).dot(lineDir);
            const withinLineBounds = projectionOnLine >= 0 && projectionOnLine <= Vector3.distance(start, end);
        
            // Retorna o ponto de interseção se válido
            if (distanceToLine <= threshold && withinLineBounds) {
                return closestPoint;
            }
        
            // Caso contrário, retorna null
            return null;
    }
}
