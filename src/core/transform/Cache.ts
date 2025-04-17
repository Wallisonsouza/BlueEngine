import Identifier from "../components/Identifier";

export default class EngineCache {
    private static _caches: Map<number, unknown> = new Map();

    public static add<T>(id: Identifier, value: T) {
        if (!this._caches.has(id.value)) {
            this._caches.set(id.value, value);
        }
    }

    public static updateCache<T>(id: Identifier, value: T) {
        if (this._caches.has(id.value)) {
            this._caches.set(id.value, value);
        }
    }

    public static get<T>(id: Identifier): T | undefined {
        return this._caches.get(id.value) as T;
    }

    public static has(id: Identifier): boolean {
        return this._caches.has(id.value);
    }

    public static remove(id: Identifier): void {
        this._caches.delete(id.value);
    }

    public static clear(): void {
        this._caches.clear();
    }
}
