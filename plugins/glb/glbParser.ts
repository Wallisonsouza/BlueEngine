interface GLTF {
    images?: { bufferView?: number, mimeType: string, uri?: string }[];
    bufferViews?: { byteOffset?: number, byteLength: number }[];
}

export class GLBParser {
    private static readonly MAGIC = 0x46546C67; // "FTL"
    private static readonly GLTF = 0x4E4F534A; // "GLTF"
    private static readonly BIN = 0x004E4942; // "BIN"

    public static validateGLBHeader(view: DataView): boolean {
        const magic = view.getUint32(0, true); 
        if (magic !== GLBParser.MAGIC) {
            throw new Error("Erro: Arquivo não é um GLB válido (cabeçalho incorreto).");
        }
        const version = view.getUint32(4, true); 
        if (version !== 2) {
            throw new Error(`Erro: Versão inválida do GLB. Esperado versão 2, mas encontrado ${version}.`);
        }
        return true;
    }

    public static extractChunk(view: DataView, offset: number): { chunkLength: number, chunkType: number, chunkData: ArrayBuffer } {
        const chunkLength = view.getUint32(offset, true);
        const chunkType = view.getUint32(offset + 4, true);
        const chunkData = view.buffer.slice(offset + 8, offset + 8 + chunkLength);
        return { chunkLength, chunkType, chunkData };
    }

    public static getGLTF(binary: ArrayBuffer): GLTF {
        const view = new DataView(binary);
        GLBParser.validateGLBHeader(view);

        let offset = 12; // Iniciar no byte 12 (onde os chunks começam)

        while (offset < view.byteLength) {
            const { chunkLength, chunkType, chunkData } = GLBParser.extractChunk(view, offset);

            if (chunkType === GLBParser.GLTF) {
                try {
                    const jsonText = new TextDecoder().decode(new Uint8Array(chunkData));
                    return JSON.parse(jsonText);
                } catch (error) {
                    throw new Error("Erro ao decodificar o chunk GLTF: " + error.message);
                }
            }

            offset += 8 + chunkLength;
        }

        throw new Error("Erro: Chunk GLTF não encontrado no arquivo.");
    }

    public static getBin(binary: ArrayBuffer): ArrayBuffer | null {
        const view = new DataView(binary);
        GLBParser.validateGLBHeader(view);

        let offset = 12;

        while (offset < view.byteLength) {
            const { chunkLength, chunkType, chunkData } = GLBParser.extractChunk(view, offset);

            if (chunkType === GLBParser.BIN) {
                return chunkData;
            }

            offset += 8 + chunkLength;
        }

        return null;
    }

    public static toGLTF(glb: ArrayBuffer) {
        const bin = this.getBin(glb);
        const gltf = this.getGLTF(glb);

        if (bin) {
            this.updateTextures(gltf, bin);
        }

        return { gltf, bin };
    }

    public static updateTextures(gltf: GLTF, bin: ArrayBuffer) {
        if (!gltf.images) return;

        for (let i = 0; i < gltf.images.length; i++) {
            const element = gltf.images[i];
            const bufferViewIndex = element.bufferView;

            if (bufferViewIndex !== undefined) {
                const bufferView = gltf.bufferViews?.[bufferViewIndex];
                if (!bufferView) continue;

                const byteOffset = bufferView.byteOffset || 0;
                const byteLength = bufferView.byteLength;
                const mimeType = element.mimeType;

                const imageData = new Uint8Array(bin, byteOffset, byteLength);
                const imageBlob = new Blob([imageData], { type: mimeType });
                const imageUrl = URL.createObjectURL(imageBlob);

                element.uri = imageUrl;
            }
        }
    }
}
