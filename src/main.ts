import Vector3 from '../engine_modules/vectors/Vector3';
import GameObject from './Engine/components/GameObject';
import Engine from './Engine/engine';
import EntityBuilder from './Engine/graphycs/EntityBuilder';
import Mesh, { WebGL2Api as WebGL2Api } from './Engine/graphycs/Mesh';
import SceneManager from './Engine/Managers/SceneManager';
import ScryptManager from './Engine/Managers/ScryptManager';
import Events from './Events';
import Camera from './Inplementations/Camera';
import SelectObjectInScene from './SelectObjectInScene';
import { Shader } from './Shader/Shader';
import SimpleEngine from './SimpleEngine';
import './style.css';

export class WindowScreen {
    private static width: number;
    private static height: number;

  
    public static setDimensions(width: number, height: number): void {
        this.width = width;
        this.height = height;
    }

    public static getScreenHeight(): number {
        return this.height;
    }

    public static getScreenWidth(): number {
        return this.width;
    }

    public static screenToNDC(screenPoint: Vector3): Vector3 {
        const x_ndc = (2 * screenPoint.x / window.innerWidth) - 1;
        const y_ndc = 1 - (2 * screenPoint.y / window.innerHeight);
        return new Vector3(x_ndc, y_ndc, screenPoint.z);
    }
}

export class Main {
    public camera: Camera;
    constructor(){

        const g = new GameObject();
        this.camera = new Camera();
        this.camera.setGameObject(g);
        this.camera.farPlane = 2000;
    }
}

Camera.main = new Main();

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
WindowScreen.setDimensions(canvas.width, canvas.height);
Events.addBlockResizeEvent();
Events.addCanvasResizeEvent(canvas);

export class DefaultValues {
    public static shader2D: Shader;
    public static gizmosShader: Shader;
    public static cubeMesh: Mesh;
    public static lineShader2D: Shader;
}

if (!canvas) {
    console.error("Elemento canvas não encontrado.");
}

const gl2 = canvas.getContext("webgl2") as WebGL2RenderingContext;

if (!gl2) {
    console.error("Não foi possível obter o contexto WebGL2.");
}

const api = new WebGL2Api(gl2);
const engine = new Engine(api);

ScryptManager.addNewScrypt(new SelectObjectInScene());
ScryptManager.addNewScrypt(new SimpleEngine());

await engine.load();
engine.initialize();


const scene = SceneManager.getCurrentScene();
const square = EntityBuilder.createSquare();
const camera = EntityBuilder.createCamera();

const hierarchy = scene.getHierarchy();

hierarchy.addGameObject(square);
hierarchy.addGameObject(camera);




// function loop(){
    
//     if(c){
        
//         const ray = editorCamera.screenPointToRay(Input.getMousePosition());
    
//         const size = new Vec3(0.5, 0.5, 0.5);
     
//         const rotation = Quat.fromEulerAngles(new Vec3(0, root, 0));

//         const endPoint = ray.origin.add(ray.direction.scale(1000));

//         Gizmos.color = Color.red
//         Gizmos.drawLine(ray.origin, endPoint)
    
//         const point = ray.intersectsRotatedBox(size, rotation);
//         if(point) {
//             Gizmos.color = Color.green;
//         } else {
//             Gizmos.color = Color.blue;
//         }

      
//         requestAnimationFrame(loop)
//     }
// }

// loop();

