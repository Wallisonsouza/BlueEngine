import BufferManager, { BufferData, ObjectBuffer } from "../../src/core/managers/BufferManager";
import GameObject from "../../src/core/components/GameObject";
import MeshFilter from "../../src/core/components/MeshFilter";
import { AlphaMode } from "../../src/core/enum/AlphaMode";
import PBRMaterial from "../../src/core/graphics/material/pbr/PBR_Material";
import Mesh from "../../src/core/graphics/mesh/Mesh";
import MeshRenderer from "../../src/core/graphics/mesh/MeshRenderer";
import Color from "../../src/core/math/color";

import Quaternion from "../../src/core/math/Quaternion";
import Vector2 from "../../src/core/math/Vector2";
import Vector3 from "../../src/core/math/Vector3";
import { ParsedMaterial, ParsedMesh, ParsedNode} from "./GLTFParsed";

export default class Conversors {

    private static loadTextures(material: PBRMaterial, parsedMaterial: ParsedMaterial) {
    
        if (parsedMaterial.textures?.baseColor?.uri) {
            material.setBaseColorTexture(`${parsedMaterial.textures.baseColor.uri}`);
            URL.revokeObjectURL(parsedMaterial.textures.baseColor.uri);
        }
 
        if (parsedMaterial.textures?.normal?.uri) {
            material.setNormalTexture(`${parsedMaterial.textures.normal.uri}`);
            URL.revokeObjectURL(parsedMaterial.textures.normal.uri);
        }
    
        if (parsedMaterial.textures?.metallicRoughness?.uri) {
            material.setMetallicRoughnessTexture(`${parsedMaterial.textures.metallicRoughness.uri}`);
            URL.revokeObjectURL(parsedMaterial.textures.metallicRoughness.uri);
        }
    
        if (parsedMaterial.textures?.emissive?.uri) {
            material.setEmissiveTexture(`${parsedMaterial.textures.emissive.uri}`);
            URL.revokeObjectURL(parsedMaterial.textures.emissive.uri);
        }
    
        if (parsedMaterial.textures?.occlusion?.uri) {
            material.setAmbientOcclusionTexture(`${parsedMaterial.textures.occlusion.uri}`);
            URL.revokeObjectURL(parsedMaterial.textures.occlusion.uri);
        }
    }
    
    private static async convertMaterials(parsedMaterials: ParsedMaterial[]): Promise<PBRMaterial[]> {
        return Promise.all(
            parsedMaterials.map(async (parsedMaterial) => {
                const material = new PBRMaterial();
                
                const color = parsedMaterial.baseColor;
                material.color = new Color(color.r, color.g, color.b);
                material.alpha = color.a;
                material.metallic = parsedMaterial.metallic;
                material.roughness = parsedMaterial.roughness;

                this.loadTextures(material, parsedMaterial);
                const emissive = parsedMaterial.emissive;
                material.emissive = new Vector3(emissive.r, emissive.g, emissive.b);
           
                if (parsedMaterial.alphaMode) {
                    switch (parsedMaterial.alphaMode) {
                        case "OPAQUE":
                            material.alphaMode = AlphaMode.OPAQUE;
                            break;
                        case "BLEND":
                            material.alphaMode = AlphaMode.BLEND;
                            break;
                        default:
                            material.alphaMode = AlphaMode.OPAQUE;
                            break;
                    }
                }
    
                return material;
            })
        );
    }
    
    // private static convertMeshes(parsedMeshes: ParsedMesh[]): Mesh[] {
    //     return parsedMeshes.map((parsedMesh) => {
    //         const mesh = new Mesh(
    //             Vector3.fromF32Array(parsedMesh.vertices),
    //             Vector3.fromF32Array(parsedMesh.normals ?? new Float32Array()),
    //             Vector2.fromF32Array(parsedMesh.uvs ?? new Float32Array()),
    //             parsedMesh.indices
    //         );
    //         mesh.name = parsedMesh.name;
    //         BufferManager.registerMesh(mesh);
    //         return mesh;
    //     });
    // }

    public static async convertMesh(parsedMesh: ParsedMesh): Promise<Mesh> {

        const mesh = new Mesh(
            Vector3.fromF32Array(parsedMesh.vertices),
            parsedMesh.indices ? parsedMesh.indices : null,
            parsedMesh.normals ? Vector3.fromF32Array(parsedMesh.normals) : null,
            parsedMesh.uvs ? Vector2.fromF32Array(parsedMesh.uvs) : null
          
        );
        mesh.name = parsedMesh.name;

        BufferManager.createMeshBuffer(mesh);
        return mesh;
    }




    private static createGameObject(name: string, position: number[], rotation: number[], scale: number[] ) {
        const gameObject = new GameObject(name);
        gameObject.transform.position = Vector3.fromArray(position);
        gameObject.transform.rotation = Quaternion.fromArray(rotation);
        gameObject.transform.scale = Vector3.fromArray(scale);
        return gameObject;
    }
    public static async toEngine3dObject(
        object: {
            nodes: ParsedNode[];
            meshes: ParsedMesh[];
            materials: ParsedMaterial[];
        },
        onObjectLoaded?: (gameObject: GameObject) => void,
    ): Promise<void> {
        // Parsear o GLTF
        const { nodes, meshes, materials } = object;
        const convertedMaterials = await this.convertMaterials(materials);
        
        const gameObjects: GameObject[] = [];
        for (const node of nodes) {
           
            const gameObject = this.createGameObject(node.name, node.translation, node.rotation, node.scale);
    
            if (node.meshIndex !== undefined) {
                const mesh = meshes[node.meshIndex];
                const convertedMesh = await this.convertMesh(mesh); 
                const meshFilter = new MeshFilter(convertedMesh);
                const meshRenderer = new MeshRenderer();
                gameObject.addComponentInstance(meshFilter);
                gameObject.addComponentInstance(meshRenderer);
    
                if (node.materialIndex !== undefined) {
                    meshRenderer.material = convertedMaterials[node.materialIndex];
                }
            }
    
            // Adiciona o gameObject ao array depois de configurá-lo
            gameObjects.push(gameObject);
    
            // Associando filhos aos pais
            if (node.childrenIndex) {
                for (const childIndex of node.childrenIndex) {
                    const child = gameObjects[childIndex];
                    if (child) {
                        child.transform.setParent(gameObject.transform);
                    }
                }
            }
    
            // Callback para objetos carregados
            if (onObjectLoaded) {
                onObjectLoaded(gameObject);
            }
        }
    }
}