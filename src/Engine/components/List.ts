/**
 * Interface para uma lista genérica de itens.
 */
interface IList<T> {
    /**
     * Adiciona um item à lista.
     * @param item O item a ser adicionado. Não pode ser null ou undefined.
     */
    add(item: T): void;

    /**
     * Adiciona um array de itens à lista, filtrando valores nulos e indefinidos.
     * @param items Array de itens a serem adicionados.
     */
    addArrayRange(items: T[]): void;

    /**
     * Adiciona os itens de outra lista à lista atual.
     * @param list Lista de itens a serem adicionados.
     */
    addListRange(list: IList<T>): void;

    /**
     * Remove o primeiro item que corresponde ao item fornecido.
     * @param item O item a ser removido.
     * @returns Verdadeiro se o item foi removido, falso caso contrário.
     */
    remove(item: T): boolean;

    /**
     * Limpa todos os itens da lista.
     */
    clear(): void;

    /**
     * Obtém o número de itens na lista.
     * @returns O número de itens.
     */
    count: number;

    /**
     * Obtém o índice do item fornecido.
     * @param item O item para localizar.
     * @returns O índice do item ou -1 se não encontrado.
     */
    indexOf(item: T): number;

    /**
     * Executa uma função para cada item da lista.
     * @param callback A função a ser executada para cada item.
     */
    forEach(callback: (item: T, index: number) => void): void;

    /**
     * Converte a lista para um array.
     * @returns Um array contendo todos os itens da lista.
     */
    toArray(): T[];

    /**
     * Verifica se a lista contém o item fornecido.
     * @param item O item a ser verificado.
     * @returns Verdadeiro se o item estiver na lista, falso caso contrário.
     */
    contains(item: T): boolean;

    /**
     * Obtém o item na posição especificada.
     * @param index O índice do item a ser obtido.
     * @returns O item na posição especificada, ou undefined se o índice for inválido.
     * @throws Error Se o índice for inválido.
     */
    get(index: number): T | undefined;

    /**
     * Classifica os itens na lista usando a função de comparação fornecida.
     * @param compareFn Função de comparação para ordenar os itens.
     */
    sort(compareFn: (a: T, b: T) => number): void;

    /**
     * Define o item na posição especificada.
     * @param index O índice do item a ser definido.
     * @param item O item a ser definido. Não pode ser null ou undefined.
     * @returns Verdadeiro se o item foi definido com sucesso, falso caso contrário.
     * @throws Error Se o índice for inválido ou o item for nulo.
     */
    set(index: number, item: T): boolean;

    /**
     * Encontra o primeiro item que atende ao critério fornecido.
     * @param callback Função de callback para testar cada item.
     * @returns O primeiro item que atende ao critério, ou null se nenhum item for encontrado.
     */
     findFirst(callback: (item: T) => boolean): T | null;

    /**
     * Encontra todos os itens que atendem ao critério fornecido.
     * @param callback Função de callback para testar cada item.
     * @returns Uma nova lista contendo todos os itens que atendem ao critério.
     */
    findAll(callback: (item: T) => boolean): IList<T>;

    /**
     * Remove o primeiro item que atende ao critério fornecido.
     * @param callback Função de callback para testar cada item.
     * @returns Verdadeiro se um item foi removido, falso caso contrário.
     */
    removeFirst(callback: (item: T) => boolean): boolean;

    /**
     * Remove todos os itens que atendem ao critério fornecido.
     * @param callback Função de callback para testar cada item.
     * @returns O número de itens removidos.
     */
    removeAll(callback: (item: T) => boolean): number;

    /**
     * Converte a lista para uma string.
     * @returns Uma representação em string da lista.
     */
    toString(): string;

    /**
     * Concatena a lista atual com outra lista.
     * @param list Lista a ser concatenada.
     * @returns Uma nova lista contendo todos os itens das duas listas.
     */
    concat(list: IList<T>): IList<T>;

    /**
     * Verifica se a lista está vazia.
     * @returns Verdadeiro se a lista estiver vazia, falso caso contrário.
     */
    isEmpty(): boolean;
}

/**
 * Lista genérica.
 */
export default class List<T> implements IList<T> {
    private _items: T[] = [];

    /**
     * Cria uma nova instância da lista.
     * @param items Itens iniciais para adicionar à lista. Pode ser um array ou outra lista.
     */
    constructor(items?: T[] | IList<T>) {
        if (Array.isArray(items)) {
            this._items = [...items];
        } else if (items instanceof List) {
            this._items = items.toArray();
        }
    }

    public add(item: T): void {
        if (item !== null && item !== undefined) {
            this._items.push(item);
        }
    }

    public addArrayRange(items: T[]): void {
        const filteredItems = items.filter(item => item !== null && item !== undefined);
        this._items.push(...filteredItems);
    }

    public addListRange(list: IList<T>): void {
        this.addArrayRange(list.toArray());
    }

    public remove(item: T): boolean {
        const index = this._items.indexOf(item);
        if (index !== -1) {
            this._items.splice(index, 1);
            return true;
        }
        return false;
    }

    public clear(): void {
        this._items = [];
    }

    public get count(): number {
        return this._items.length;
    }

    public indexOf(item: T): number {
        return this._items.indexOf(item);
    }

    public forEach(callback: (item: T, index: number) => void): void {
        this._items.forEach(callback);
    }

    public toArray(): T[] {
        return [...this._items];
    }

    public contains(item: T): boolean {
        return this._items.includes(item);
    }

    public get(index: number): T | undefined {
        if (index < 0 || index >= this._items.length) {
            throw new Error("Índice inválido");
        }
        return this._items[index];
    }

    public sort(compareFn: (a: T, b: T) => number): void {
        this._items.sort(compareFn);
    }

    public set(index: number, item: T): boolean {
        if (index < 0 || index >= this._items.length || item === null || item === undefined) {
            throw new Error("Índice inválido ou item nulo");
        }
        this._items[index] = item;
        return true;
    }

    public filter(predicate: (item: T) => boolean): T[] {
        return this._items.filter(predicate);
    }

    public findFirst(callback: (item: T) => boolean): T | null {
        const result = this._items.find(callback);
        return result ?? null;
    }

    public findAll(callback: (item: T) => boolean): IList<T> {
        return List.fromArray(this._items.filter(callback));
    }

    public removeFirst(callback: (item: T) => boolean): boolean {
        const index = this._items.findIndex(callback);
        if (index !== -1) {
            this._items.splice(index, 1);
            return true;
        }
        return false;
    }

    public removeAll(callback: (item: T) => boolean): number {
        const originalLength = this._items.length;
        this._items = this._items.filter(item => !callback(item));
        return originalLength - this._items.length;
    }

    public toString(): string {
        return `[${this._items.join(", ")}]`;
    }

    public concat(list: IList<T>): IList<T> {
        return new List<T>([...this._items, ...list.toArray()]);
    }

    public isEmpty(): boolean {
        return this._items.length === 0;
    }

    public static fromArray<T>(array: T[]): IList<T> {
        return new List<T>(array);
    }

    public static empty<T>(): IList<T> {
        return new List<T>();
    }

    public static sort<T>(list: IList<T>, compareFn: (a: T, b: T) => number): IList<T> {
        return new List<T>([...list.toArray()].sort(compareFn));
    }
}
