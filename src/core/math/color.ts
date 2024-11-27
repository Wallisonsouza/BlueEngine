import Mathf from "./Mathf";

export default class Color {
    public r: number;
    public g: number;
    public b: number;
    public a: number;

    public get rgb() {
        return [this.r, this.g, this.b];
    }

    public get rgba() {
        return [this.r, this.g, this.b, this.a];
    }
   

    //#region Cores Predefinidas

    /** Cor branca. */
    public static get white(): Color {
        return new Color(1, 1, 1, 1);
    }

    /** Cor preta. */
    public static get black(): Color {
        return new Color(0, 0, 0, 1);
    }

    /** Cor vermelha. */
    public static get red(): Color {
        return new Color(1, 0, 0, 1);
    }

    /** Cor verde. */
    public static get green(): Color {
        return new Color(0, 1, 0, 1);
    }

    /** Cor azul. */
    public static get blue(): Color {
        return new Color(0, 0, 1, 1);
    }

    /** Cor amarela. */
    public static get yellow(): Color {
        return new Color(1, 1, 0, 1);
    }

    /** Cor ciano. */
    public static get cyan(): Color {
        return new Color(0, 1, 1, 1);
    }

    /** Cor magenta. */
    public static get magenta(): Color {
        return new Color(1, 0, 1, 1);
    }

    /** Cor laranja. */
    public static get orange(): Color {
        return new Color(1, 0.647, 0, 1);
    }

    /** Cor roxa. */
    public static get purple(): Color {
        return new Color(0.5, 0, 0.5, 1);
    }

    /** Cor rosa. */
    public static get pink(): Color {
        return new Color(1, 0.753, 0.796, 1);
    }

    /** Cor marrom. */
    public static get brown(): Color {
        return new Color(0.6, 0.4, 0.2, 1);
    }

    /** Cor cinza. */
    public static get gray(): Color {
        return new Color(0.5, 0.5, 0.5, 1);
    }

    /** Cor cinza claro. */
    public static get lightGray(): Color {
        return new Color(0.75, 0.75, 0.75, 1);
    }

    /** Cor cinza escuro. */
    public static get darkGray(): Color {
        return new Color(0.25, 0.25, 0.25, 1);
    }

    //#endregion

    //#region Cores Adicionais

    /** Verde-água. */
    public static get teal(): Color {
        return new Color(0, 0.5, 0.5, 1);
    }

    /** Coral. */
    public static get coral(): Color {
        return new Color(1, 0.5, 0.31, 1);
    }

    /** Lavanda. */
    public static get lavender(): Color {
        return new Color(0.9, 0.8, 1, 1);
    }

    /** Dourado. */
    public static get gold(): Color {
        return new Color(1, 0.84, 0, 1);
    }

    /** Prateado. */
    public static get silver(): Color {
        return new Color(0.75, 0.75, 0.75, 1);
    }

    /** Verde menta. */
    public static get mintGreen(): Color {
        return new Color(0.6, 1, 0.6, 1);
    }

    /** Salmão. */
    public static get salmon(): Color {
        return new Color(1, 0.5, 0.5, 1);
    }

    /** Índigo. */
    public static get indigo(): Color {
        return new Color(0.294, 0, 0.51, 1);
    }

    /** Pêssego. */
    public static get peach(): Color {
        return new Color(1, 0.85, 0.725, 1);
    }

    /** Blush Lavanda. */
    public static get lavenderBlush(): Color {
        return new Color(1, 0.94, 0.96, 1);
    }

    //#endregion

    //#region Cores Pastéis

    /** Azul pastel. */
    public static get pastelBlue(): Color {
        return new Color(0.68, 0.85, 0.9, 1);
    }

    /** Verde pastel. */
    public static get pastelGreen(): Color {
        return new Color(0.7, 1, 0.7, 1);
    }

    /** Rosa pastel. */
    public static get pastelPink(): Color {
        return new Color(1, 0.7, 0.8, 1);
    }

    /** Amarelo pastel. */
    public static get pastelYellow(): Color {
        return new Color(1, 1, 0.8, 1);
    }

    /** Roxo pastel. */
    public static get pastelPurple(): Color {
        return new Color(0.8, 0.7, 1, 1);
    }

    //#endregion

    constructor(r: number, g: number, b: number, a: number = 1.0) {
        this.r = Mathf.clamp01(r);
        this.g = Mathf.clamp01(g);
        this.b = Mathf.clamp01(b);
        this.a = Mathf.clamp01(a);
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
        factor = Mathf.clamp01(factor);
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
    
    public static fromArray(array: number[]) {
        return new Color(array[0], array[1], array[2], array[3]);
    }
        
    public toString(): string {
        return `rgba(${Math.round(this.r * 255)}, ${Math.round(this.g * 255)}, ${Math.round(this.b * 255)}, ${this.a})`;
    }
}
