import Vector3 from "../../engine_modules/vectors/Vector3";
import Gizmos from "../Engine/graphycs/Gizmos";
import Camera from "../components/Camera";

export class CameraGizmos {

    /**
     * Desenha o frustum da câmera no modo perspectiva.
     * @param camera - A câmera cuja visão do frustum deve ser desenhada.
     */
    public static drawPerspectiveGizmos(camera: Camera): void {
        const tan = 2 * Math.tan(camera.fieldOfView * 0.5 * Math.PI / 180);
        const nearHeight = tan * camera.nearPlane;
        const nearWidth = nearHeight * camera.aspectRatio;
        const farHeight = tan * camera.farPlane;
        const farWidth = farHeight * camera.aspectRatio;

        const position = camera.transform.position;
        const forward = camera.transform.backward.normalize();
        const up = camera.transform.upward.normalize();
        const right = forward.cross(up).normalize();

        const nearCenter = position.add(forward.scale(camera.nearPlane));
        const farCenter = position.add(forward.scale(camera.farPlane));

        const nearCorners = this.calculateFrustumCorners(nearCenter, up, right, nearWidth, nearHeight);
        const farCorners = this.calculateFrustumCorners(farCenter, up, right, farWidth, farHeight);

        this.drawFrustumPlane(nearCorners);
        this.drawFrustumPlane(farCorners);

        for (let i = 0; i < 4; i++) {
            Gizmos.drawLine(nearCorners[i], farCorners[i]);
        }
    }

    /**
     * Calcula os cantos do frustum para um plano dado.
     * @param center - O centro do plano do frustum.
     * @param up - O vetor para cima.
     * @param right - O vetor para a direita.
     * @param width - A largura do frustum.
     * @param height - A altura do frustum.
     * @returns - Os vetores dos cantos do frustum.
     */
    private static calculateFrustumCorners(center: Vector3, up: Vector3, right: Vector3, width: number, height: number): Vector3[] {
        const halfWidth = width / 2;
        const halfHeight = height / 2;

        return [
            center.add(up.scale(halfHeight)).subtract(right.scale(halfWidth)),
            center.add(up.scale(halfHeight)).add(right.scale(halfWidth)),
            center.subtract(up.scale(halfHeight)).subtract(right.scale(halfWidth)),
            center.subtract(up.scale(halfHeight)).add(right.scale(halfWidth))
        ];
    }

    /**
     * Desenha um plano do frustum conectando os cantos.
     * @param corners - Os vetores dos cantos do plano.
     */
    private static drawFrustumPlane(corners: Vector3[]): void {
        Gizmos.drawLine(corners[0], corners[1]);
        Gizmos.drawLine(corners[1], corners[3]);
        Gizmos.drawLine(corners[3], corners[2]);
        Gizmos.drawLine(corners[2], corners[0]);
    }
}
