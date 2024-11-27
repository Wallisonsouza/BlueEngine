type VEC3 = [number, number, number];
type VEC4 = [number, number, number, number];

export interface ParsedObject {
    node: ParsedNode;
    mesh?: ParsedMesh;
    material?: ParsedMaterial;
  
}

export interface ParsedMesh {
    name: string;
    vertices: Float32Array;
    normals?: Float32Array;
    uvs?: Float32Array;
    indices?: Uint16Array | Uint32Array;
    materialIndex?: number;
}

export interface ParsedMaterial {
    name: string;
    baseColor: VEC4; 
    metallic: number; 
    roughness: number; 
    texturePath?: string;
    normalPath?: string;
    metallicRoughnessPath?: string;
}

export interface ParsedNode {
    name: string;
    mesh?: number;
    translation: VEC3;
    rotation: VEC4; 
    scale: VEC3;
    childrenIndex?: number[];
}