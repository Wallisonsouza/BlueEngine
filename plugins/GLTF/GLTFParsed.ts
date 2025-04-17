import { GLTFSamplers } from "./GLTFSchema";

type VEC3 = [number, number, number];
type VEC4 = [number, number, number, number];

export interface ParsedObject {
    node: ParsedNode;
    mesh?: ParsedMesh;
    materials?: ParsedMaterial[];
  
}

export interface ParsedMesh {
    name: string;
    vertices: Float32Array;
    normals?: Float32Array;
    uvs?: Float32Array;
    indices?: number[]
    materialIndex?: number;
}

export interface TextureInfo {
    uri?: string;
    sampler?: GLTFSamplers;
}


export interface ParsedMaterial {
    name: string; // Nome do material
    baseColor: {r: number, g: number, b: number, a: number};
    emissive: {r: number, g: number, b: number};
    metallic: number; // Fator metálico (0 a 1)
    roughness: number; // Fator de rugosidade (0 a 1)
    alphaMode: string; // Modo de alpha (ex: 'OPAQUE', 'TRANSPARENT', etc.)
    
    textures?: {
        baseColor?: TextureInfo; // Textura de cor base
        normal?: TextureInfo; // Textura de normal map
        metallicRoughness?: TextureInfo; // Textura de metálico e rugosidade
        emissive?: TextureInfo; // Textura emissiva
        occlusion?: TextureInfo; // Textura de oclusão
    };
}


export interface ParsedNode {
    name: string;
    meshIndex?: number;
    materialIndex?: number;
    translation: VEC3;
    rotation: VEC4; 
    scale: VEC3;
    childrenIndex?: number[];
}