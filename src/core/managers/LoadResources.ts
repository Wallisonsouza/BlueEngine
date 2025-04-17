import Engine from "../engine";
import Texture from "../graphics/material/Texture";

export default class LoadResources {
  
    private static textureCache = new Map<string, Texture>();
    public static async loadTextFile(url: string): Promise<string> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Falha ao carregar o arquivo de texto: ${url}`);
        }

        return await response.text();
    }

    public static async loadBinaryFile(
        url: string,
        onProgress?: (percentage: number) => void
    ): Promise<ArrayBuffer> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Falha ao carregar o arquivo binário: ${url}`);
        }

        // Obtém o tamanho total do arquivo, se disponível.
        const contentLengthHeader = response.headers.get("Content-Length");
        const totalBytes = contentLengthHeader
            ? parseInt(contentLengthHeader, 10)
            : null;

        if (!response.body) {
            // Se não houver suporte a streams, fallback para arrayBuffer
            return await response.arrayBuffer();
        }

        const reader = response.body.getReader();
        const chunks: Uint8Array[] = [];
        let receivedLength = 0;

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
                chunks.push(value);
                receivedLength += value.length;

                // Se totalBytes estiver disponível, calcula e dispara a porcentagem
                if (totalBytes && onProgress) {
                    const percentage = (receivedLength / totalBytes) * 100;
                    onProgress(percentage);
                }
            }
        }

        // Concatena os chunks em um único ArrayBuffer
        const result = new Uint8Array(receivedLength);
        let position = 0;
        for (const chunk of chunks) {
            result.set(chunk, position);
            position += chunk.length;
        }

        return result.buffer;
    }

    public static async loadGLB(url: string): Promise<ArrayBuffer> {
        return this.loadBinaryFile(url);
    }

    public static async loadGLTF(
        url: string
    ): Promise<{ json: any; bin: ArrayBuffer }> {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Falha ao carregar o arquivo GLTF: ${url}`);
        }

        const jsonText = await response.text();
        const json = JSON.parse(jsonText);

        let bin: ArrayBuffer = new ArrayBuffer();
        if (json.buffers && json.buffers.length > 0) {
            const bufferUri = json.buffers[0].uri;
            if (bufferUri) {
                const binUrl = `${url.substring(0, url.lastIndexOf("/"))}/${bufferUri}`;
                console.log(`Carregando binário de: ${binUrl}`);
                bin = await LoadResources.loadBinaryFile(binUrl);
            }
        }

        return { json, bin };
    }

    public static async loadTexture(
        url: string,
        minFilter?: number,
        magFilter?: number,
        wrapS?: number,
        wrapT?: number
    ): Promise<Texture> {
        if (this.textureCache.has(url)) {
            console.log(url);
            return this.textureCache.get(url)!;
        }

        const gl = Engine.gl;
        const texture = new Texture(url);
        await texture.load(gl, minFilter, magFilter, wrapS, wrapT);
        this.textureCache.set(url, texture);

        return texture;
    }

    public static async loadImage(url: string): Promise<HTMLImageElement> {
        return new Promise<HTMLImageElement>((resolve, reject) => {
            const img = new Image();
    
            img.onload = () => resolve(img);
            img.onerror = (error) => reject(new Error(`Falha ao carregar a imagem de ${url}: ${error}`));
    
            img.src = url;
        });
    }
    
}
