export default class Color {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    //#region Getters 

    public static get white(): Color {
        return new Color(1.0, 1.0, 1.0, 1.0);
    }

    public static get black(): Color {
        return new Color(0, 0, 0, 1);
    }

    public static get red(): Color {
        return new Color(1, 0, 0, 1);
    }

    public static get green(): Color {
        return new Color(0, 1, 0, 1);
    }

    public static get blue(): Color {
        return new Color(0, 0, 1, 1);
    }

    public static get yellow(): Color {
        return new Color(1, 1, 0, 1);
    }

    public static get cyan(): Color {
        return new Color(0, 1, 1, 1);
    }

    public static get magenta(): Color {
        return new Color(1, 0, 1, 1);
    }

    public static get orange(): Color {
        return new Color(1, 0.647, 0, 1);
    }

    public static get purple(): Color {
        return new Color(0.5, 0, 0.5, 1);
    }

    public static get pink(): Color {
        return new Color(1, 0.753, 0.796, 1);
    }

    public static get brown(): Color {
        return new Color(0.6, 0.4, 0.2, 1);
    }

    public static get gray(): Color {
        return new Color(0.5, 0.5, 0.5, 1);
    }

    public static get lightGray(): Color {
        return new Color(0.75, 0.75, 0.75, 1);
    }

    public static get darkGray(): Color {
        return new Color(0.25, 0.25, 0.25, 1);
    }

    //#endregion

    constructor(r: number, g: number, b: number, a: number = 1.0) {
        this.r = Math.max(0, Math.min(r, 1));
        this.g = Math.max(0, Math.min(g, 1));
        this.b = Math.max(0, Math.min(b, 1));
        this.a = Math.max(0, Math.min(a, 1));
    }

    public toString(): string {
        return `rgba(${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)}, ${this.a})`;
    }

    public toArray(): [number, number, number, number] {
        return [this.r, this.g, this.b, this.a];
    }

    public static hexToRGBA(hex: string): Color {
        hex = hex.replace(/^#/, '');

        let r, g, b, a = 1;
        if (hex.length === 6) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
        } else if (hex.length === 8) {
            r = parseInt(hex.substring(0, 2), 16);
            g = parseInt(hex.substring(2, 4), 16);
            b = parseInt(hex.substring(4, 6), 16);
            a = parseInt(hex.substring(6, 8), 16) / 255;
        } else if (hex.length === 4) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
        } else if (hex.length === 5) {
            r = parseInt(hex[1] + hex[1], 16);
            g = parseInt(hex[2] + hex[2], 16);
            b = parseInt(hex[3] + hex[3], 16);
            a = parseInt(hex[4] + hex[4], 16) / 255;
        } else {
            throw new Error("Formato hexadecimal inválido.");
        }

        return new Color(r / 255, g / 255, b / 255, a);
    }

    public blend(other: Color, factor: number): Color {
        factor = Math.max(0, Math.min(factor, 1));
        return new Color(
            this.r * (1 - factor) + other.r * factor,
            this.g * (1 - factor) + other.g * factor,
            this.b * (1 - factor) + other.b * factor,
            this.a * (1 - factor) + other.a * factor
        );
    }

    public static random(min: number = 0, max: number = 1, includeAlpha: boolean = false): Color {
        const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);
        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const r = clamp(randomInRange(min, max), 0, 1);
        const g = clamp(randomInRange(min, max), 0, 1);
        const b = clamp(randomInRange(min, max), 0, 1);
        const a = includeAlpha ? clamp(randomInRange(min, max), 0, 1) : 1;

        return new Color(r, g, b, a);
    }
    public rgbArray(){
        return [this.r, this.g, this.b];
    }

}
