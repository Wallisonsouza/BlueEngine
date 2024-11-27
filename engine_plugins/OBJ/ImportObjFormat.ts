/**
 * Classe responsável por carregar arquivos OBJ e MTL.
 * 
 * Esta classe facilita a importação de modelos 3D em formato OBJ,
 * oferecendo uma interface assíncrona para carregar o conteúdo do arquivo e
 * seus materiais correspondentes em MTL.
 */
export default class ImportObjFormat {
    private readonly objFilePath: string;
    public mtlFilePath: string | null;

    /**
     * Construtor da classe ImportObjFormat.
     * 
     * @param filePath O caminho para o arquivo OBJ a ser carregado.
     */
    constructor(filePath: string) {
        this.objFilePath = filePath;
        this.mtlFilePath = null; // Inicialmente nulo, será definido ao carregar o OBJ
    }

    /**
     * Carrega o conteúdo do arquivo OBJ a partir do caminho especificado.
     * 
     * @returns Uma promessa que resolve para o conteúdo do arquivo OBJ como uma string.
     * @throws Lança um erro se houver falha ao carregar o arquivo.
     */
    public async loadOBJ(): Promise<string> {
        const response = await fetch(this.objFilePath);

        if (!response.ok) {
            throw new Error(`Erro ao carregar o arquivo OBJ: ${response.statusText}`);
        }

        const objContent = await response.text();
        this.mtlFilePath = this.extractMtlFilePath(objContent);
        return objContent;
    }

    /**
     * Extrai o caminho do arquivo MTL do conteúdo do arquivo OBJ.
     * 
     * @param objContent O conteúdo do arquivo OBJ.
     * @returns O caminho do arquivo MTL ou null se não encontrado.
     */
    private extractMtlFilePath(objContent: string): string | null {
        const mtlRegex = /mtllib\s+(\S+)/;
        const match = objContent.match(mtlRegex);
        return match ? match[1] : null;
    }

    /**
     * Carrega o conteúdo do arquivo MTL a partir do caminho especificado.
     * 
     * @returns Uma promessa que resolve para o conteúdo do arquivo MTL como uma string.
     * @throws Lança um erro se houver falha ao carregar o arquivo.
     */
    public async loadMTL(): Promise<string | null> {
        if (!this.mtlFilePath) {
            return null; // Se não houver arquivo MTL associado, retorna null
        }

        const response = await fetch(this.mtlFilePath);

        if (!response.ok) {
            throw new Error(`Erro ao carregar o arquivo MTL: ${response.statusText}`);
        }

        return response.text();
    }
}
