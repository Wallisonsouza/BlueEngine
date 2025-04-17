export default class Identifier {
    private static currentId = 0;
    private static recycledIds: number[] = [];

    private readonly _value: number;

    private constructor(id: number) {
        this._value = id;
    }

    public static create(): Identifier {
        const id = this.recycledIds.length > 0
            ? this.recycledIds.pop()!
            : this.currentId++;
        return new Identifier(id);
    }

    public static recycle(id: Identifier): void {
        this.recycledIds.push(id.value);
    }

    public get value(): number {
        return this._value;
    }

    public equals(other: Identifier): boolean {
        return this._value === other._value;
    }

    public toString(): string {
        return `ID(${this._value})`;
    }
}
