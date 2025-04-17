export default class State<T> {
    private _value: T;
    private onChange?: (newValue: T, oldValue: T) => void;

    constructor(initialValue: T, onChange?: (newValue: T, oldValue: T) => void) {
        this._value = initialValue;
        this.onChange = onChange;
    }

    public get value(): T {
        return this._value;
    }

    public set value(newValue: T) {
        if (newValue !== this._value) {
            const oldValue = this._value;
            this._value = newValue;
            this.onChange?.(newValue, oldValue);
        }
    }

    public setOnChange(callback: (newValue: T, oldValue: T) => void) {
        this.onChange = callback;
    }
}
