export default class State<T> {
    private _value: T;
    private onChange?: (newValue: T, oldValue: T) => void;
    private comparator: (a: T, b: T) => boolean;

    constructor(
        initialValue: T,
        onChange?: (newValue: T, oldValue: T) => void,
        comparator: (a: T, b: T) => boolean = (a, b) => a === b 
    ) {
        this._value = initialValue;
        this.onChange = onChange;
        this.comparator = comparator;
    }

    public get(): T {
        return this._value;
    }

    public set(newValue: T) {
        if (!this.comparator(newValue, this._value)) {
            const oldValue = this._value;
            this._value = newValue;
            this.onChange?.(newValue, oldValue);
        }
    }

    public forceSet(newValue: T) {
        const oldValue = this._value;
        this._value = newValue;
        this.onChange?.(newValue, oldValue);
    }

    public setOnChange(callback: (newValue: T, oldValue: T) => void) {
        this.onChange = callback;
    }
    
}
