import BufferManager, {  } from "./managers/BufferManager";
import MeshManager from "./managers/MeshManager";
import ShaderManager from "./managers/ShaderManager";
import SquareGeometry from "./geometries/SquareGeometry";
import PlaneGeometry from "./geometries/PlaneGeometry";
import CubeGeometry from "./geometries/CubeGeometry";
import SphereGeometry from "./geometries/SphereGeometry";
import Vector3 from "./math/Vector3";

export async function loadDependencies() {

    await Promise.all([
        ShaderManager.createShader(
            "src/core/graphics/shaders/post_processing/fullscreen.vert",
            "src/core/graphics/shaders/post_processing/fullscreen.frag",
            "fullscreen"
        ),
        ShaderManager.createShader(
            "src/core/graphics/shaders/post_processing/shadow.vert",
            "src/core/graphics/shaders/post_processing/shadow.frag",
            "shadow"
        ),

        ShaderManager.createShader(
            "src/core/graphics/shaders/3d/StandardShader.vert",
            "src/core/graphics/shaders/3d/StandardShader.frag",
            "Standard Shader"
        ),
        ShaderManager.createShader(
            "src/core/graphics/shaders/3d/StandardPBRShader.vert",
            "src/core/graphics/shaders/3d/StandardPBRShader.frag",
            "3d"
        ),
        ShaderManager.createShader(
            "src/core/graphics/shaders/3d/PreFilterIBL.vert",
            "src/core/graphics/shaders/3d/PreFilterIBL.frag",
            "filter"
        ),
        ShaderManager.createShader(
            "src/core/graphics/shaders/3d/PreFilterIBL.vert",
            "src/core/graphics/shaders/3d/PreFilterIBL.frag",
            "ibl"
        ),
        ShaderManager.createShader(
            "src/core/graphics/shaders/2d.vert",
            "src/core/graphics/shaders/2d.frag",
            "2D"
        ),
        ShaderManager.createShader(
            "src/core/graphics/shaders/gizmos.vert",
            "src/core/graphics/shaders/gizmos.frag",
            "Gizmos"
        ),
        ShaderManager.createShader(
            "src/core/graphics/shaders/line.vert",
            "src/core/graphics/shaders/line.frag",
            "Line"
        ),
        ShaderManager.createShader(
            "src/core/graphics/shaders/preprocessing/lut/LUT.vert",
            "src/core/graphics/shaders/preprocessing/lut/LUT.frag",
            "lut"
        )
    ]);
    
    //#region  GEOMETRIES
        const plane = PlaneGeometry.create();
        plane.name = "plane";
        MeshManager.addMesh(plane);
        BufferManager.createMeshBuffer(plane);

        const square = SquareGeometry.create(new Vector3(2, 2, 2));
        square.name = "square";
        MeshManager.addMesh(square);
        BufferManager.createMeshBuffer(square);

  


        const cube = CubeGeometry.create();
        cube.name = "cube";
        MeshManager.addMesh(cube);
        BufferManager.createMeshBuffer(cube);

        const sphere = SphereGeometry.create();
        sphere.name = "sphere";
        MeshManager.addMesh(sphere);
        BufferManager.createMeshBuffer(sphere);
    //#endregion
  
}

// const texturePromises = [
//     LoadResources.loadImage("assets/cubeMap/default/right.bmp"),  // Positive X
//     LoadResources.loadImage("assets/cubeMap/default/left.bmp"),   // Negative X
//     LoadResources.loadImage("assets/cubeMap/default/top.bmp"),    // Positive Y
//     LoadResources.loadImage("assets/cubeMap/default/bottom.bmp"), // Negative Y
//     LoadResources.loadImage("assets/cubeMap/default/front.bmp"),  // Positive Z
//     LoadResources.loadImage("assets/cubeMap/default/back.bmp")    // Negative Z
// ];

// const [right, left, top, bottom, front, back] = await Promise.all(texturePromises);
// const envMap = TextureBuilder.createCubemapTexture(gl, back, front, left, right, top, bottom);
// WorldOptions.environmentTexture = envMap;