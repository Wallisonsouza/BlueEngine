import { GLBParser } from "../../plugins/glb/glbParser";
import Conversors from "../../plugins/GLTF/ConvertGltf";
import GLTFParser from "../../plugins/GLTF/GLTFLoader";
import GameObjectBuilder from "../../src/core/Builders/GameObjectBuilder";
import CameraControler from "./CameraControler";
import Camera from "../../src/core/components/Camera";
import Scrypt from "../../src/core/components/Scrypt";
import LoadResources from "../../src/core/managers/LoadResources";
import SceneManager from "../../src/core/managers/SceneManager";
import Color from "../../src/core/math/color";
import CameraObject from "../../src/core/Builders/objects/CameraObject";
import SphereObject from "../../src/core/Builders/objects/SphereObject";
import GameObject from "../../src/core/components/GameObject";
import CubeObject from "../../src/core/Builders/objects/CubeObject";
import PlaneObject from "../../src/core/Builders/objects/PlaneObject";
import DirecionalLightObject from "../../src/core/Builders/objects/DirecionalLightObject";
import Vector3 from "../../src/core/math/Vector3";

export default class SimpleScene extends Scrypt {
    
    private car!: GameObject;
    
    start(): void {

        const camera = CameraObject.createMainCamera();
        camera.addComponent(CameraControler);
        const sunLight = DirecionalLightObject.create();
        const ambientLight = GameObjectBuilder.createAmbientLight(new Color(0.051, 0.051, 0.051));
        const cam = camera.getComponentByType<Camera>(Camera.TYPE);
        
        if(cam) {
            cam.clearColor = new Color(0.0, 0.0, 0.0).toSRGB();
        }
        
        const cube = CubeObject.create();
        cube.transform.position = new Vector3(0, 10, 0)
        const plane = PlaneObject.create();
        SceneManager.addGameObjects([
                camera, 
                cube,
                plane,
                ambientLight,
                sunLight,
            ]
        );

        this.car = new GameObject("car");
        this.car.transform.position = new Vector3(0 ,2, 0)
        LoadResources.loadGLB("assets/3d/lamborghini_diablo_sv.glb").then((data) => {
            const gltf = GLBParser.toGLTF(data);
            const parsedGflt = GLTFParser.parse(gltf);
          
            
            Conversors.toEngine3dObject(parsedGflt,
                (object) => { 
                    object.transform.hierarchy.setParent(this.car.transform)
                    SceneManager.addGameObject(object);
                    
                }
            );
        });
    }


    onUpdate(): void {
        // this.car.transform.rotate(Vector3.UP, Time.deltaTime * 4)
    }

}
