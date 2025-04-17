import Mathf from "./Mathf";

export default class Color {

    public r: number;
    public g: number;
    public b: number;
    public a: number;

    constructor(r: number, g: number, b: number, a: number = 1.0) {
        this.r = Mathf.clamp01(r);
        this.g = Mathf.clamp01(g);
        this.b = Mathf.clamp01(b);
        this.a = Mathf.clamp01(a);
    }

    public toSRGB(): Color {
        return new Color(
            this.linearToSRGB(this.r),
            this.linearToSRGB(this.g),
            this.linearToSRGB(this.b),
            this.a
        );
    }

    private linearToSRGB(value: number): number {
        return (value <= 0.0031308) 
            ? value * 12.92
            : 1.055 * Math.pow(value, 1.0 / 2.4) - 0.055;
    }

    public get rgb() {
        return [this.r, this.g, this.b];
    }

    public get rgba() {
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

    public equals(other: Color): boolean {
      
        return (
            this.r === other.r &&
            this.g === other.g &&
            this.b === other.b &&
            this.a === other.a
        );
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

    public toF32Array() {
        return new Float32Array([this.r, this.g, this.b]);
    }
        
    public static readonly WHITE = new Color(1, 1, 1, 1);
    public static readonly BLACK = new Color(0, 0, 0, 1);
    public static readonly RED = new Color(1, 0, 0, 1);
    public static readonly GREEN = new Color(0, 1, 0, 1);
    public static readonly BLUE = new Color(0, 0, 1, 1);
    public static readonly YELLOW = new Color(1, 1, 0, 1);
    public static readonly CYAN = new Color(0, 1, 1, 1);
    public static readonly MAGENTA = new Color(1, 0, 1, 1);
    public static readonly ORANGE = new Color(1, 0.647, 0, 1);
    public static readonly PURPLE = new Color(0.5, 0, 0.5, 1);
    public static readonly PINK = new Color(1, 0.753, 0.796, 1);
    public static readonly BROWN = new Color(0.6, 0.4, 0.2, 1);
    public static readonly GRAY = new Color(0.5, 0.5, 0.5, 1);
    public static readonly LIGHT_GRAY = new Color(0.75, 0.75, 0.75, 1);
    public static readonly DARK_GRAY = new Color(0.25, 0.25, 0.25, 1);
    public static readonly TEAL = new Color(0, 0.5, 0.5, 1);
    public static readonly CORAL = new Color(1, 0.5, 0.31, 1);
    public static readonly LAVENDER = new Color(0.9, 0.8, 1, 1);
    public static readonly GOLD = new Color(1, 0.84, 0, 1);
    public static readonly SILVER = new Color(0.75, 0.75, 0.75, 1);
    public static readonly MINT_GREEN = new Color(0.6, 1, 0.6, 1);
    public static readonly SALMON = new Color(1, 0.5, 0.5, 1);
    public static readonly INDIGO = new Color(0.294, 0, 0.51, 1);
    public static readonly PEACH = new Color(1, 0.85, 0.725, 1);
    public static readonly LAVENDER_BLUSH = new Color(1, 0.94, 0.96, 1);
    public static readonly PASTEL_BLUE = new Color(0.68, 0.85, 0.9, 1);
    public static readonly PASTEL_GREEN = new Color(0.7, 1, 0.7, 1);
    public static readonly PASTEL_PINK = new Color(1, 0.7, 0.8, 1);
    public static readonly PASTEL_YELLOW = new Color(1, 1, 0.8, 1);
    public static readonly PASTEL_PURPLE = new Color(0.8, 0.7, 1, 1);
    public static readonly LIME = new Color(0.75, 1, 0, 1); 
    public static readonly PERIWINKLE = new Color(0.8, 0.8, 1, 1); 
    public static readonly MOSS_GREEN = new Color(0.5, 0.6, 0.3, 1);
    public static readonly SKY_BLUE = new Color(0.53, 0.81, 0.92, 1);
    public static readonly MAUVE = new Color(0.88, 0.63, 0.82, 1);
    public static readonly CHARCOAL = new Color(0.22, 0.24, 0.27, 1);
    public static readonly LAVENDER_PURPLE = new Color(0.58, 0.44, 0.86, 1); 
    public static readonly SEAFOAM_GREEN = new Color(0.48, 1, 0.52, 1);
    public static readonly FUCHSIA = new Color(0.88, 0.06, 0.45, 1);
}
