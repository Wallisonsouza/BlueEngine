import Quaternion from "../engine_modules/module_vectors/Quaternion";
import Vector3 from "../engine_modules/module_vectors/Vector3";
import GameObject from "../src/Engine/components/GameObject";

interface AnimationData {
    obj: GameObject;
    position: { start: Vector3; end: Vector3 };
    rotation: { start: Quaternion; end: Quaternion };
    duration: number;
    elapsed: number;
    returning: boolean;
}

export class ExplosionEffect {
    private animations: AnimationData[] = [];

    constructor(private objects: GameObject[]) {}

    public explodeFromMousePosition(mouseX: number, mouseY: number, maxDistance: number, duration: number): void {
        this.animations = this.objects.map((obj) => {
            // Converte as coordenadas do mouse em um vetor de posição
            const mousePosition = obj.transform.transformPointToWorldSpace(new Vector3(mouseX, mouseY, 0));

            // Calcula a direção oposta à posição do mouse
            const direction = mousePosition.subtract(obj.transform.position).normalize().multiplyScalar(-1);
            const randomOffset = direction.multiplyScalar(Math.random() * maxDistance);

            const startPosition = obj.transform.position.clone();
            const endPosition = startPosition.add(randomOffset);

            const startRotation = obj.transform.rotation.clone();
            const endRotation = Quaternion.random().multiply(startRotation);

            return {
                obj,
                position: { start: startPosition, end: endPosition },
                rotation: { start: startRotation, end: endRotation },
                duration,
                elapsed: 0,
                returning: false
            };
        });
    }

    public updateAnimations(deltaTime: number): void {
        this.animations.forEach((anim) => {
            anim.elapsed += deltaTime;
            const t = Math.min(anim.elapsed / anim.duration, 1); // Normaliza o valor de interpolação entre 0 e 1

            // Interpola posição e rotação para cada objeto com base no tempo decorrido
            anim.obj.transform.position = Vector3.lerp(anim.position.start, anim.position.end, t);
            anim.obj.transform.rotation = Quaternion.slerp(anim.rotation.start, anim.rotation.end, t);
        });
    }
}
