import Engine from './core/engine';
import ScryptManager from './core/managers/ScryptManager';
import Events from './Events';
import SimpleEngine from './SimpleEngine';
import './style.css';

import MeshRenderer from './core/graphics/mesh/MeshRenderer';
import Material3D from './core/graphics/material/Material3D';
import { BufferManager } from './core/managers/BufferManager';

import Color from './core/math/color';
import DirecionalLight from './core/components/DirecionalLight';


import GLTFLoader from '../engine_plugins/GLTF/GLTFLoader';
import {ParsedMaterial, ParsedMesh} from '../engine_plugins/GLTF/GLTFParsed';
import MeshFilter from './core/components/MeshFilter';
import GameObject from './core/components/GameObject';
import Mesh from './core/graphics/mesh/Mesh';
import { WebGL2Api } from './core/graphics/mesh/WebGl2Api';
import Quaternion from './core/math/Quaternion';
import Vector3 from './core/math/Vector3';
import GameObjectFactory from './core/factory/GameObjectFactory';

export class WindowScreen {
    private static width: number = 0;
    private static height: number = 0; 

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
        if (this.width === 0 || this.height === 0) {
            throw new Error("WindowScreen dimensions are not set.");
        }
        const x_ndc = (2 * screenPoint.x / this.width) - 1;
        const y_ndc = 1 - (2 * screenPoint.y / this.height);
        return new Vector3(x_ndc, y_ndc, screenPoint.z);
    }
}

const canvas = document.getElementById("canvas") as HTMLCanvasElement;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
WindowScreen.setDimensions(window.innerWidth, window.innerHeight);

window.addEventListener("resize", (e) => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    WindowScreen.setDimensions(window.innerWidth, window.innerHeight);
})

Events.addBlockResizeEvent();

if (!canvas) {
    console.error("Elemento canvas não encontrado.");
}

const gl2 = canvas.getContext("webgl2", { 
    stencil: false,
    depth: true,
    alpha: true, 
    desynchronized: false,
    powerPreference: 'high-performance',
  
     
}) as WebGL2RenderingContext;

if (!gl2) {
    console.error("Não foi possível obter o contexto WebGL2.");
}

const api = new WebGL2Api(gl2);
const engine = new Engine(api);
await engine.load();

const parser = new GLTFLoader();
const objects = await parser.load('untitled.gltf');

const gameObjects : {gameObject: GameObject, children?: number[]}[] = [];

function createMesh(ParsedMesh: ParsedMesh) {


    const mesh = new Mesh(ParsedMesh.vertices, ParsedMesh.normals, ParsedMesh.uvs, ParsedMesh.indices);
    BufferManager.registerMesh(mesh);
    return mesh;
}

const camera = GameObjectFactory.createCamera();
camera.tag = "MainCamera";
GameObject.addGameObject(camera);


//------------------------------------------------------

// const matRef = new Material3D();
// await matRef.setReflectionMap("ninomaru_teien.webp");

async function createMaterial(pMaterial: ParsedMaterial) {
    const material = new Material3D();
    material.color = new Color(pMaterial.baseColor[0], pMaterial.baseColor[1], pMaterial.baseColor[2]);
    material.alpha = pMaterial.baseColor[3];
    material.metalic = pMaterial.metallic;
    material.roughness = pMaterial.roughness;

    // if(pMaterial.texturePath) {
    //     await material.setBaseColorTexture(pMaterial.texturePath);
    // }
    // if(pMaterial.normalPath) {
    //     await material.setNormalTexture(pMaterial.normalPath);
    // }
    // if(pMaterial.metallicRoughnessPath) {
    //     await material.setMetallicRoughnessTexture(pMaterial.metallicRoughnessPath);
    // }

    // material.environmentTexture = matRef.environmentTexture;
    
    return material;
}

for (let index = 0; index < objects.length; index++) {
    const element = objects[index];
    const gameObject = new GameObject(element.node.name);
    gameObject.transform.scale = Vector3.fromArray(element.node.scale);
    gameObject.transform.rotation = Quaternion.fromArray(element.node.rotation);
    gameObject.transform.position = Vector3.fromArray(element.node.translation);

    // Cria e adiciona a mesh e material, se existirem
    if (element.mesh && element.material) {
        const mesh = createMesh(element.mesh);
       
        const meshFilter = new MeshFilter(mesh);
        const meshRenderer = new MeshRenderer();

        const material =  await createMaterial(element.material);
        meshRenderer.material = material;
    
        gameObject.addComponentInstance(meshRenderer);
        gameObject.addComponentInstance(meshFilter);
    }

    // Armazena o GameObject e seus índices de filhos
    gameObjects.push({ gameObject, children: element.node.childrenIndex });
    
}

gameObjects.forEach(({ gameObject, children }) => {
    children?.forEach(childIndex => {
        const childObject = gameObjects[childIndex].gameObject;
        childObject.transform.setParent(gameObject.transform);
    });
});

//---------------------------------------------------------------------

const light1 = new GameObject("Light1");
light1.transform.position = new Vector3(0, 5, 0);
light1.transform.rotation = Quaternion.fromEulerAngles(new Vector3(90, 0, 0));

const lightComponent = new DirecionalLight();
lightComponent.setGameObject(light1);
light1.addComponentInstance(lightComponent);


const tree = new GameObject();
gameObjects.forEach(g => {
    g.gameObject.transform.setParent(tree.transform);
});


GameObject.addGameObject(tree);



GameObject.addGameObject(light1);

engine.initialize();
ScryptManager.addNewScrypt(new SimpleEngine());






// const terrain = new GameObject("New Cube");




// const t = new TerrainGenerator().generateTerrain();
// let mesh = t.terrain;
// mesh.recalculateNormals();
// const meshFilter = new MeshFilter(mesh);
// const meshRenderer = new MeshRenderer();
// const material = new Material3D();
// meshRenderer.material = material;
// terrain.addComponentInstance(meshRenderer);
// terrain.addComponentInstance(meshFilter);
// terrain.addComponent(BoxCollider);
// BufferManager.registerMesh(mesh);

// GameObject.addGameObject(terrain);