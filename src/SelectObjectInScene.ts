import Input from "./Base/Input/Input";
import MonoComportament from "./Engine/components/MonoComportament";
import Renderer from "./Engine/graphycs/Renderer";
import SceneManager from "./Engine/Managers/SceneManager";


export default class SelectObjectInScene extends MonoComportament {

    // public update(): void {
    //     if(Input.getMouseButtonDown(0)){

    //         const gameObjects = SceneManager
    //         .getCurrentScene()
    //         .getHierarchy()
    //         .getGameObjects();
            
    //         gameObjects.forEach(gameObject => {
    //             const renderers = gameObject.getComponents(Renderer);
    //             renderers.forEach(renderer => {
    //                 if(renderer instanceof SpriteRenderer2D) {
    //                     const sprite = renderer.sprite;

    //                     console.log(sprite)
    //                 }
    //             });
            
    //         });
    //     }
    // }
}