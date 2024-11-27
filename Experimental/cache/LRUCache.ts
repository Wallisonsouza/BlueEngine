/**
 * O algoritmo LRU (Least Recently Used) mantém no cache os itens mais recentemente usados, 
 * eliminando os itens menos utilizados quando o cache atinge sua capacidade máxima.
 * Esta classe implementa um cache LRU usando um Map para gerenciar as entradas.
 * @author [Wallison Souza]
 */

export default class LRUCache<K, V> {
    private capacity: number;
    private cache: Map<K, V>;

    /**
     * @param capacity - A capacidade máxima do cache. Quando o cache atinge esse limite,
     *                   o item menos recentemente usado é removido.
     */
    constructor(capacity: number) {
        this.capacity = capacity;
        this.cache = new Map<K, V>();
    }

    /**
     * Obtém o valor associado a uma chave no cache, se presente. 
     * Se a chave for encontrada, ela é marcada como a mais recentemente usada.
     * 
     * @param key - A chave do item a ser recuperado do cache.
     * @returns O valor associado à chave, ou undefined se a chave não estiver presente.
     */
    get(key: K): V | undefined {
        const value = this.cache.get(key);
        if (value !== undefined) {
            this.cache.delete(key);
            this.cache.set(key, value);
        }
        return value;
    }

    /**
     * Adiciona um item ao cache. Se o cache já contiver a chave, 
     * o item é atualizado e marcado como o mais recentemente usado.
     * Se o cache estiver cheio, o item menos recentemente usado é removido.
     * 
     * @param key - A chave do item a ser adicionado ao cache.
     * @param value - O valor do item a ser adicionado ao cache.
     */
    set(key: K, value: V): void {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        } else if (this.cache.size >= this.capacity) {
            const lruKey = this.cache.keys().next().value;
            this.cache.delete(lruKey);
        }
        
        this.cache.set(key, value);
    }

    /**
     * Retorna o número de itens atualmente armazenados no cache.
     * 
     * @returns O número de itens no cache.
     */
    size(): number {
        return this.cache.size;
    }

    /**
     * Limpa todos os itens do cache.
     */
    clear(): void {
        this.cache.clear();
    }
}
