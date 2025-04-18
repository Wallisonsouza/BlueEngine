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

    // Retorna o valor atual
    public get(): T {
        return this._value;
    }

    // Método para garantir que o valor foi alterado
    public set(newValue: T) {
        if (!this.comparator(newValue, this._value)) {
            const oldValue = this._value;
            this._value = newValue;
            this.onChange?.(newValue, oldValue);
        }
    }

    // Força a alteração do valor, mesmo sem mudança
    public forceSet(newValue: T) {
        const oldValue = this._value;
        this._value = newValue;
        this.onChange?.(newValue, oldValue);
    }

    // Atualiza o callback de mudança
    public setOnChange(callback: (newValue: T, oldValue: T) => void) {
        if (callback && typeof callback !== 'function') {
            throw new Error('onChange must be a function');
        }
        this.onChange = callback;
    }

    // Método adicional para obter o estado
    public getState(): T {
        return this._value;
    }
}
