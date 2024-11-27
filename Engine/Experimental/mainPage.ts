// import Input from "../src/Base/Input/Input";
// import Camera from "../src/components/Camera";
// import MeshRenderer from "../src/components/MeshRenderer";
// import MonoComportament from "../src/Engine/components/MonoComportament";
// import SceneManager from "../src/Engine/Managers/SceneManager";
// import Color from "../src/Engine/static/color";
// import Time from "../src/Engine/static/Time";
// import { ExplosionEffect, NoGravityEffect } from "./explosionEfect";


// export default class MainPage extends MonoComportament {
//     private explosion: ExplosionEffect;
//     private noGravity: NoGravityEffect;
 

//     public start(): void {

//         const hierarchy = SceneManager.getCurrentScene().getHierarchy();
        
//        const iphone =  hierarchy.getGameObjectByName("metallic")?.getComponent(MeshRenderer);

//        if(iphone && iphone.material) {
//         Camera.main.camera.clearColor = iphone.material?.color.blend(Color.black, 0.5);
//        }

//         this.explosion = new ExplosionEffect(hierarchy.getGameObjects());
//         this.explosion.explodeFromMousePosition(Input.mousePosition.x, Input.mousePosition.y, 20, 2);
//     }

//     public update(): void {

//         if(Input.getMouseButtonDown(0)) {
//             this.explosion.explodeFromMousePosition(Input.mousePosition.x, Input.mousePosition.y, 20, 2);
//         }
//         this.explosion.updateAnimations(Time.deltaTime);
//     }
// }