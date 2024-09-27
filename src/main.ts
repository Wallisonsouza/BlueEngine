import Vector3 from '../engine_modules/vectors/Vector3';
import GameObject from './Engine/components/GameObject';
import Engine from './Engine/engine';
import { WebGL2Api as WebGL2Api } from './Engine/graphycs/Mesh';
import SceneManager from './Engine/Managers/SceneManager';
import ScryptManager from './Engine/Managers/ScryptManager';
import Events from './Events';
import Camera from './components/Camera';
import SimpleEngine from './SimpleEngine';
import './style.css';
import EntityBuilder from './Engine/graphycs/EntityBuilder';
import MeshBuilder from './Engine/graphycs/MeshFactory';
import Vector2 from '../engine_modules/vectors/Vector2';
import MeshRenderer from './components/MeshRenderer';
import Material3D from './Engine2D/Material/Material3D';

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
        this.camera.farPlane = 1000;
    }
}

Camera.main = new Main();

const canvas = document.getElementById("canvas") as HTMLCanvasElement;
WindowScreen.setDimensions(canvas.width, canvas.height);
Events.addBlockResizeEvent();
Events.addCanvasResizeEvent(canvas);

if (!canvas) {
    console.error("Elemento canvas não encontrado.");
}

const gl2 = canvas.getContext("webgl2", { stencil: false, preserveDrawingBuffer: true, depth: true, antialias: true,  }) as WebGL2RenderingContext;

if (!gl2) {
    console.error("Não foi possível obter o contexto WebGL2.");
}

gl2.depthFunc(gl2.LEQUAL); 
gl2.cullFace(gl2.BACK); 
ScryptManager.addNewScrypt(new SimpleEngine());

const api = new WebGL2Api(gl2);
const engine = new Engine(api);

await engine.load();



const scene = SceneManager.getCurrentScene();
const hierarchy = scene.getHierarchy();


const material = new Material3D();
material.tiling = new Vector2(1, 1);
material.setAlbedo("/brick/Poliigon_BrickWallReclaimed_8320_BaseColor.jpg");
material.setNormalMap("/brick/Poliigon_BrickWallReclaimed_8320_Normal.png");

let teste = 0;
for (let index = 0; index < 10; index++) {
    const mesh = MeshBuilder.createCube();
    const cube = new GameObject("new Cube");
    const meshRenderer = new MeshRenderer(); 
    meshRenderer.material = material;
    meshRenderer.mesh = mesh;
    cube.transform.position.x = teste;
    cube.addComponentInstance(meshRenderer);
    hierarchy.addGameObject(cube);
}

// function loop(){
    
//     sprite.transform.rotate(Quaternion.fromEulerAngles(new Vector3(0, 1, 0)))
//     requestAnimationFrame(loop);
// }

// loop();

// const objFormat = new Inport("/koenigsegg.obj");
// const objFormatString = await objFormat.loadOBJ();

// if (!objFormatString) {
//     console.error("Failed to load OBJ format.");
   
// }

// const shader = await Shader.createShaderAsync (
//     "/shaders/defaultShader3D.vert",
//     "/shaders/defaultShader3D.frag"
// );

// const material = new Material3D();
// material.shader = shader;

// // await material.setAlbedo("/DragoonEgg_Tex.png");

// const mesh = ObjFormart.process(objFormatString);
// const engineMesh = new Mesh(
//     mesh.verticesFloat32(),
//     mesh.vertexIndicesUint16(),
//     mesh.normalsFloat32(),
//     mesh.textureFloat32()
// );
// engineMesh.compile();

// let teste = 0;
// for(let i = 0; i < 1; i++) {
//     const gameObject = new GameObject();
//     const renderer = new MeshRenderer();

//     teste -= 10;
//     gameObject.transform.translate(new Vector3(0, 0, teste));
    
//     renderer.mesh = engineMesh;
//     renderer.material = material;
//     gameObject.addComponentInstance(renderer);
//     gameObject.addComponent(BoxCollider);
//     hierarchy.addGameObject(gameObject);
// }










engine.initialize();