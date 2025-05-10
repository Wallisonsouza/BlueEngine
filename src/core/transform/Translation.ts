import { Space } from "../enum/Space";
import Quaternion from "../math/Quaternion";
import Vector3 from "../math/Vector3";

export default class Translation {
    public static createTranslationByDirection(
        position: Vector3,
        rotation: Quaternion,
        translation: Vector3,
        space: Space = Space.SELF
    ): Vector3 {
        switch (space) {
            case Space.SELF:
                const localTranslation = rotation.transformVector3(translation);
                position.addInPlace(localTranslation);
                break;

            case Space.WORLD:
                position.addInPlace(translation);
                break;

            default:
                console.error('Espaço de translação inválido. Use Space.SELF ou Space.WORLD.');
                break;
        }

        return position;
    }
}
