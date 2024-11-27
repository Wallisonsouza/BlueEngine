import {
    GLTF, 
    GLTFComponentType,
    GLTFBuffer,
    GLTFIdentifier, 
} from "./GLTFSchema";

import {
    ParsedMaterial, 
    ParsedMesh, 
    ParsedNode, 
    ParsedObject
} from "./GLTFParsed";


export default class GLTFParser {

    async load(url: string) {
        const response = await fetch(url);
        const gltf: GLTF = await response.json();

        const buffers = await this.loadBuffers(gltf.buffers, url);
        const materials = this.extractMaterials(gltf); 
        const meshes = this.extractMeshes(gltf, buffers);
        const nodes = this.extractNodes(gltf);
        
        const parsedObjects: ParsedObject[] = nodes.map((node) => {
            const mesh = node.mesh !== undefined ? meshes[node.mesh] : undefined;
            const material = mesh?.materialIndex !== undefined ? materials[mesh.materialIndex] : undefined;

            return {
                node: node,
                mesh: mesh,
                material: material
            } as ParsedObject;
        });

        return parsedObjects
     
    }

    private async loadBuffers(buffers: GLTFBuffer[], baseUrl: string): Promise<ArrayBuffer[]> {
        const bufferPromises = buffers.map(async (buffer) => {
            const response = await fetch(this.resolveUri(baseUrl, buffer.uri));
            return await response.arrayBuffer();
        });
        return Promise.all(bufferPromises);
    }

    private resolveUri(baseUrl: string, relativeUri: string): string {
        const base = new URL(baseUrl, window.location.href);
        return new URL(relativeUri, base).href;
    }


    private getAccessorData(gltf: GLTF, accessorIndex: number, buffers: ArrayBuffer[]) {
        const accessor = gltf.accessors[accessorIndex];
        const bufferView = gltf.bufferViews[accessor.bufferView];
        const buffer = buffers[bufferView.buffer];
    
        const byteOffset = (bufferView.byteOffset || 0) + (accessor.byteOffset || 0);
        const numComponents = this.getNumComponents(accessor.type);
        const elementCount = accessor.count * numComponents;
    
        switch (accessor.componentType) {
            case GLTFComponentType.FLOAT:
                return new Float32Array(buffer, byteOffset, elementCount);
            case GLTFComponentType.UNSIGNED_SHORT:
                return new Uint16Array(buffer, byteOffset, elementCount);
            case GLTFComponentType.UNSIGNED_INT:
                return new Uint32Array(buffer, byteOffset, elementCount);
            case GLTFComponentType.BYTE:
                return new Int8Array(buffer, byteOffset, elementCount);
            case GLTFComponentType.UNSIGNED_BYTE:
                return new Uint8Array(buffer, byteOffset, elementCount);
            case GLTFComponentType.SHORT:
                return new Int16Array(buffer, byteOffset, elementCount);
            default:
                throw new Error(`Componente não suportado: ${accessor.componentType}`);
        }
    }
    
    private getNumComponents(type: GLTFIdentifier): number {
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

    private extractNodes(gltf: GLTF) {
        const parsedNodes: ParsedNode[] = [];
    
        gltf.nodes.forEach((node, index) => {
            const parsedNode: ParsedNode = {
                name: node.name || `Node_${index}`,
                mesh: node.mesh, 
                translation: node.translation ?? [0, 0, 0],
                rotation: node.rotation ?? [0, 0, 0, 1],
                scale: node.scale ?? [1, 1, 1],
                childrenIndex: node.children
            };
    
            parsedNodes.push(parsedNode);
        });
    
        return parsedNodes;
    }
    
    private extractMeshes(gltf: GLTF, buffers: ArrayBuffer[]): ParsedMesh[] {
        const parsedMeshes: ParsedMesh[] = [];

        gltf.meshes.forEach(({ name, primitives }) => {
           
            primitives.forEach(primitive => {
                const vertices = this.getAccessorData(gltf, primitive.attributes.POSITION, buffers);
    
                const indices = primitive.indices ? this.getAccessorData(gltf, primitive.indices, buffers) : undefined;
    
                const normals = primitive.attributes.NORMAL ? this.getAccessorData(gltf, primitive.attributes.NORMAL, buffers) : undefined;
                const uvs = primitive.attributes.TEXCOORD_0 ? this.getAccessorData(gltf, primitive.attributes.TEXCOORD_0, buffers) : undefined;
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
    
    private extractMaterials(gltf: GLTF): ParsedMaterial[] {
        const parsedMaterials: ParsedMaterial[] = [];
    
        if (gltf.materials) {
            gltf.materials.forEach(material => {
                const baseColorFactor = material.pbrMetallicRoughness?.baseColorFactor;
                const metallicFactor = material.pbrMetallicRoughness?.metallicFactor;
                const roughnessFactor = material.pbrMetallicRoughness?.roughnessFactor;
                const imageIndex = material.pbrMetallicRoughness?.baseColorTexture?.index;
                const normalIndex = material.normalTexture?.index;
                const roughnessIndex = material.pbrMetallicRoughness?.metallicRoughnessTexture?.index;

              
                let texture: string | undefined = undefined;
                if (imageIndex !== undefined) {
                    const a = gltf.textures[imageIndex];
                    texture = gltf.images[a.source].uri;
                }

                let normalTexture: string | undefined = undefined;
                if (normalIndex !== undefined) {
                    const normalTextureInfo = gltf.textures[normalIndex];
                    normalTexture = gltf.images[normalTextureInfo.source].uri;
                }

                let roughnessTexture: string | undefined = undefined;
                if (roughnessIndex !== undefined) {
                    const roughnessTextureInfo = gltf.textures[roughnessIndex];
                    roughnessTexture = gltf.images[roughnessTextureInfo.source].uri;
                }


                const parsedMaterial: ParsedMaterial = {
                    name: material.name || "Unnamed Material",
                    baseColor: baseColorFactor ?? [1, 1, 1, 1], 
                    metallic: metallicFactor ?? 1.0, 
                    roughness: roughnessFactor ?? 1.0,
                    texturePath: texture,
                    normalPath: normalTexture,
                    metallicRoughnessPath: roughnessTexture
                };
    
                parsedMaterials.push(parsedMaterial);
            });
            
        }
    
        return parsedMaterials;
    }
}

