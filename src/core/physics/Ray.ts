import Vector3 from "../math/Vector3";

export default class Ray {
    origin: Vector3; 
    direction: Vector3;

    constructor(origin: Vector3, direction: Vector3) {
        this.origin = origin;
        this.direction = direction.normalize(); 
    }

    public intersectTriangle(rayOrigin: Vector3, rayDirection: Vector3, v0: Vector3, v1: Vector3, v2: Vector3): { t: number, point: Vector3 } | null {
        const edge1 = v1.subtract(v0);
        const edge2 = v2.subtract(v0);
        const h = rayDirection.cross(edge2);
        const a = edge1.dot(h);

        if (Math.abs(a) < 1e-6) return null; // Paralelo ao triângulo

        const f = 1.0 / a;
        const s = rayOrigin.subtract(v0);
        const u = f * s.dot(h);

        if (u < 0.0 || u > 1.0) return null; // Fora do triângulo

        const q = s.cross(edge1);
        const v = f * rayDirection.dot(q);

        if (v < 0.0 || u + v > 1.0) return null; // Fora do triângulo

        const t = f * edge2.dot(q);

        if (t > 1e-6) {
            const point = rayOrigin.add(rayDirection.scale(t));
            return { t, point };
        }

        return null; // Sem interseção
    }
    
    public intersectsLine(
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
