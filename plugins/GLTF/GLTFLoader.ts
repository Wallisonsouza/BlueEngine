import {
    GLTF, 
    GLTFComponentType,
    GLTFIdentifier,
    GLTFSamplers,
} from "./GLTFSchema";

import {
    ParsedMaterial, 
    ParsedMesh, 
    ParsedNode,
    TextureInfo, 
} from "./GLTFParsed";



export default class GLTFParser {

    static parse(object: { gltf: any, bin: ArrayBuffer | null }) {
        const json = object.gltf; // O json já foi carregado
        const bin = object.bin; // O .bin já foi carregado

        if(!json) {
            throw new Error("aaaaaaaaaaaa")
        }

        if(!bin) {
            throw new Error("bbbbbbbbbbbbbbb")
        }
    
        const materials = this.extractMaterials(json);
        const meshes = this.extractMeshes(json, bin);
        const nodes = this.extractNodes(json);
    
        return { nodes, meshes, materials };
    }

    //   private static async loadBuffers(buffers: GLTFBuffer[], bin: ArrayBuffer | null): Promise<ArrayBuffer[]> {
    //     const bufferPromises = buffers.map(async (buffer) => {
    //         return bin;
         
    //     });
    //     return Promise.all(bufferPromises);
    // }
    
    private static resolveUri(baseUrl: string, relativeUri: string): string {
        const base = new URL(baseUrl, window.location.href);
        return new URL(relativeUri, base).href;
    }







    // static async parser(url: string) {
    //     const response = await fetch(url);
    //     const gltf: GLTF = await response.json();

    //     const buffers = await this.loadBuffers(gltf.buffers, url);
    //     const materials = this.extractMaterials(gltf); 
    //     const meshes = this.extractMeshes(gltf, buffers);
    //     const nodes = this.extractNodes(gltf);
    //     return {nodes, meshes, materials};
     
    // }

    // private static async loadBuffers(buffers: GLTFBuffer[], baseUrl: string): Promise<ArrayBuffer[]> {
    //     const bufferPromises = buffers.map(async (buffer) => {
    //         const response = await fetch(this.resolveUri(baseUrl, buffer.uri));
    //         console.log("a")
    //         return await response.arrayBuffer();
         
    //     });
    //     return Promise.all(bufferPromises);
    // }


    private static getAccessorData<T extends Float32Array | Uint16Array | Uint32Array | Int8Array | Uint8Array | Int16Array>(
        gltf: GLTF,
        accessorIndex: number,
        buffer: ArrayBuffer
    ): T {
        const accessor = gltf.accessors[accessorIndex];
        const bufferView = gltf.bufferViews[accessor.bufferView];
   
        const byteOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
        const numComponents = this.getNumComponents(accessor.type);
        const elementCount = accessor.count * numComponents;
        
        switch (accessor.componentType) {
            case GLTFComponentType.FLOAT:
                return new Float32Array(buffer, byteOffset, elementCount) as T;
            case GLTFComponentType.UNSIGNED_SHORT:
                return new Uint16Array(buffer, byteOffset, elementCount) as T;
            case GLTFComponentType.UNSIGNED_INT:
                return new Uint32Array(buffer, byteOffset, elementCount) as T;
            case GLTFComponentType.BYTE:
                return new Int8Array(buffer, byteOffset, elementCount) as T;
            case GLTFComponentType.UNSIGNED_BYTE:
                return new Uint8Array(buffer, byteOffset, elementCount) as T;
            case GLTFComponentType.SHORT:
                return new Int16Array(buffer, byteOffset, elementCount) as T;
            default:
                throw new Error(`Componente não suportado: ${accessor.componentType}`);
        }
    }
    
    private static getNumComponents(type: GLTFIdentifier): number {
        switch (type) {
          
            case GLTFIdentifier.SCALAR: return 1;
            case GLTFIdentifier.VEC2: return 2;
            case GLTFIdentifier.VEC3: return 3;
            case GLTFIdentifier.VEC4: return 4;
            case GLTFIdentifier.MAT2: return 4;
            case GLTFIdentifier.MAT3: return 9;
            case GLTFIdentifier.MAT4: return 16;
            default: {
                console.error(`Tipo inválido recebido: ${type}`);
                throw new Error('Tipo inválido');
            }
        }
    }

    private static extractNodes(gltf: GLTF) {
        const parsedNodes: ParsedNode[] = [];
    
        gltf.nodes.forEach((node, index) => {
            // Recuperar o índice da malha do nó
            const meshIndex = node.mesh;
            
            // Recuperar o índice do material, se existir
            let materialIndex;
            if (meshIndex !== undefined && gltf.meshes[meshIndex]?.primitives) {
                const primitive = gltf.meshes[meshIndex].primitives[0]; // Considerando apenas o primeiro primitivo
                materialIndex = primitive.material; // Obter o índice do material, se disponível
            }
    
            const parsedNode: ParsedNode = {
                name: node.name || `Node_${index}`,
                meshIndex,
                materialIndex, // Adicionado o índice do material
                translation: node.translation ?? [0, 0, 0],
                rotation: node.rotation ?? [0, 0, 0, 1],
                scale: node.scale ?? [1, 1, 1],
                childrenIndex: node.children
            };
    
            parsedNodes.push(parsedNode);
        });
    
        return parsedNodes;
    }
    
    private static extractMeshes(gltf: GLTF, buffer: ArrayBuffer): ParsedMesh[] {
        const parsedMeshes: ParsedMesh[] = [];

        gltf.meshes.forEach(({ name, primitives }) => {
           
            primitives.forEach(primitive => {
                const vertices = this.getAccessorData(gltf, primitive.attributes.POSITION, buffer);
    
                const indices = primitive.indices ? this.getAccessorData(gltf, primitive.indices, buffer) : undefined;
    
                const normals = primitive.attributes.NORMAL ? this.getAccessorData(gltf, primitive.attributes.NORMAL, buffer) : undefined;
                const uvs = primitive.attributes.TEXCOORD_0 ? this.getAccessorData(gltf, primitive.attributes.TEXCOORD_0, buffer) : undefined;
                const materialId = primitive.material ?? undefined;
    
                parsedMeshes.push({
                    name: name || "Unnamed Mesh",
                    vertices: vertices as Float32Array,
                    normals: normals as Float32Array | undefined,
                    uvs: uvs as Float32Array | undefined,
                    indices: indices as Uint32Array | Uint16Array | undefined,
                    materialIndex: materialId
                });
            });
        });
    
        return parsedMeshes;
    }
    
    private static extractMaterials(gltf: GLTF): ParsedMaterial[] {
        const parsedMaterials: ParsedMaterial[] = [];
    
        if (gltf.materials) {
            gltf.materials.forEach((material, index) => {
                const { 
                    pbrMetallicRoughness, 
                    normalTexture, 
                    occlusionTexture, 
                    alphaMode, 
                    name, 
                    emissiveTexture,
                    emissiveFactor
                } = material;
                const { 
                    baseColorTexture, 
                    metallicRoughnessTexture 
                } = pbrMetallicRoughness || {};
    
                const parsedMaterial: ParsedMaterial = {
                    name: name || `Unnamed Material${index}`,
                    baseColor: this.getRgba(pbrMetallicRoughness?.baseColorFactor ?? []),
                    metallic: pbrMetallicRoughness?.metallicFactor ?? 1.0,
                    roughness: pbrMetallicRoughness?.roughnessFactor ?? 1.0,
                    alphaMode: alphaMode ?? "OPAQUE",
                    emissive: this.getRgb(emissiveFactor ?? []),
                    textures: {
                        baseColor: baseColorTexture ? this.processTexture(gltf, baseColorTexture.index) : undefined,
                        normal: normalTexture ? this.processTexture(gltf, normalTexture.index) : undefined,
                        emissive: emissiveTexture ? this.processTexture(gltf, emissiveTexture.index) : undefined,
                        metallicRoughness: metallicRoughnessTexture ? this.processTexture(gltf, metallicRoughnessTexture.index) : undefined,
                        occlusion: occlusionTexture ? this.processTexture(gltf, occlusionTexture.index) : undefined
                    }
                };
                parsedMaterials.push(parsedMaterial);
            });
        }
    
        return parsedMaterials;
    }

    private static getRgb(array: number[]): { r: number, g: number, b: number} {
        return { r: array[0] ?? 0, g: array[1] ?? 0, b: array[2] ?? 0};
    }

    private static getRgba(array: number[]): { r: number, g: number, b: number, a: number } {
        return { r: array[0] ?? 1, g: array[1]?? 1, b: array[2]?? 1, a: array[3]??1 };
    }
    
    private static getTextureURI(gltf: GLTF, textureIndex: number | undefined): string | undefined {
        if (textureIndex !== undefined) {
            const texture = gltf.textures[textureIndex];
            return gltf.images[texture.source]?.uri;
        }
        return undefined;
    }
    
    private static getSampler(gltf: GLTF, textureIndex: number | undefined): GLTFSamplers |undefined{
        if (textureIndex !== undefined) {
            const texture = gltf.textures[textureIndex];
            if (texture.sampler !== undefined) {
                return gltf.samplers[texture.sampler];
            }
        }
        return undefined;
    }
    
    private static processTexture(gltf: GLTF, textureIndex: number | undefined): TextureInfo {
        const uri = this.getTextureURI(gltf, textureIndex);
        const sampler = this.getSampler(gltf, textureIndex);
        
        return {
            sampler,
            uri
        };
    }
    
}

