import Vector3 from '../engine_modules/vectors/Vector3';
import GameObject from './Engine/components/GameObject';
import Engine from './Engine/engine';
import Mesh, { WebGL2Api as WebGL2Api } from './Engine/graphycs/Mesh';
import SceneManager from './Engine/Managers/SceneManager';
import ScryptManager from './Engine/Managers/ScryptManager';
import Material3D from './Engine2D/Material/Material3D';
import Events from './Events';
import Camera from './components/Camera';
import { Shader } from './Shader/Shader';
import SimpleEngine from './SimpleEngine';
import './style.css';
import Inport from '../engine_plugins/obj-looader/ImportObjFormat';
import ObjFormart from '../engine_plugins/obj-looader/ObjFormat';
import MeshRenderer from './Engine/graphycs/MeshRenderer';


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

export class DefaultValues {
    public static shader2D: Shader;
    public static gizmosShader: Shader;
    public static cubeMesh: Mesh;
    public static lineShader2D: Shader;
    public static shader3D: Shader;
}

if (!canvas) {
    console.error("Elemento canvas não encontrado.");
}

const gl2 = canvas.getContext("webgl2", { preserveDrawingBuffer: true, depth: true, antialias: true, }) as WebGL2RenderingContext;

if (!gl2) {
    console.error("Não foi possível obter o contexto WebGL2.");
}

ScryptManager.addNewScrypt(new SimpleEngine());

const api = new WebGL2Api(gl2);
const engine = new Engine(api);


await engine.load();
engine.initialize();


const scene = SceneManager.getCurrentScene();
const hierarchy = scene.getHierarchy();

const objFormat = new Inport("/koenigsegg.obj");
const objFormatString = await objFormat.loadOBJ();

if (!objFormatString) {
    console.error("Failed to load OBJ format.");
   
}

const shader = await Shader.createShaderAsync (
    "/shaders/defaultShader3D.vert",
    "/shaders/defaultShader3D.frag"
);

shader.compile();

const material = new Material3D();
material.shader = shader;

await material.setAlbedo("/Texture_100Animals_BaseColor.png")

const mesh = ObjFormart.process(objFormatString);

 const gameObject = new GameObject();
    const renderer = new MeshRenderer();
    const engineMesh = new Mesh();
    engineMesh.vertices = mesh.verticesFloat32();
    engineMesh.normals = mesh.normalsFloat32();
    engineMesh.indices = mesh.vertexIndicesUint16();
    engineMesh.uvs = mesh.textureFloat32();
  
    engineMesh.compile();
    renderer.mesh = engineMesh;
    renderer.material = material;
    gameObject.addComponentInstance(renderer);
    hierarchy.addGameObject(gameObject);