import Identifier from "./Identifier";

type ChangeCallback = () => void;


class ObservableObject {
    private values = new Map<string, any>();
    private callbacks = new Map<string, ChangeCallback>();

    protected defineObservable<T>(key: string, initial: T, onChange: ChangeCallback) {
        this.values.set(key, initial);
        this.callbacks.set(key, onChange);

        Object.defineProperty(this, key, {
            get: () => this.values.get(key),
            set: (value: T) => {
                if (this.values.get(key) !== value) {
                    this.values.set(key, value);
                    onChange();
                }
            },
            enumerable: true,
            configurable: true,
        });
    }
}

export default class Entity extends ObservableObject{
    private readonly _id: Identifier;

    public get id(): Identifier {
        return this._id;
    }

    constructor() {
        super();
        this._id = Identifier.create();
    }

    public destroy(): void {
        Identifier.recycle(this._id);
        console.log(`Destroyed entity with ${this._id}`);
    }
}
