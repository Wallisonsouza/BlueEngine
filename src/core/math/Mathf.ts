type Point = { x: number, y: number };

export default class Mathf {
    //#region Constants
    public static readonly INFINITY = Infinity;
    public static readonly PI = Math.PI;
    public static readonly PI2 = Math.PI * 2;
    public static readonly PI_HALF = Math.PI / 2;
    public static readonly PI_QUARTER = Math.PI / 4;
    public static readonly RAD2DEG = 180 / Math.PI;
    public static readonly DEG2RAD = Math.PI / 180;
    //#endregion

    //#region Math
    public static abs = Math.abs;
    public static acos = Math.acos;
    public static asin = Math.asin;
    public static atan = Math.atan;
    public static atan2 = Math.atan2;
    public static ceil = Math.ceil;
    public static cos = Math.cos;
    public static exp = Math.exp;
    public static floor = Math.floor;
    public static log = Math.log;
    public static max = Math.max;
    public static min = Math.min;
    public static pow = Math.pow;
    public static random = Math.random;
    public static round = Math.round;
    public static sin = Math.sin;
    public static sqrt = Math.sqrt;
    public static tan = Math.tan;
    public static clz32 = Math.clz32;
    public static imul = Math.imul;
    public static sign = Math.sign;
    public static log10 = Math.log10;
    public static log2 = Math.log2;
    public static log1p = Math.log1p;
    public static expm1 = Math.expm1;
    public static cosh = Math.cosh;
    public static sinh = Math.sinh;
    public static tanh = Math.tanh;
    public static acosh = Math.acosh;
    public static asinh = Math.asinh;
    public static atanh = Math.atanh;
    public static hypot = Math.hypot;
    public static trunc = Math.trunc;
    public static fround = Math.fround;
    public static cbrt = Math.cbrt;
    //#endregion

    //#region Methods
    public static randomRange(min: number, max: number): number {
        return Math.random() * (max - min) + min;
    }

    public static angleBetweenTwoPoints(x1: number, y1: number, x2: number, y2: number): number {
        return Math.atan2(y2 - y1, x2 - x1);
    }

    public static clampAngle(angle: number, min: number, max: number): number {
        const normalized = ((angle % 360) + 360) % 360;
        return Math.min(Math.max(normalized, min), max);
    }

    public static isPowerOfTwo(value: number): boolean {
        return (value > 0) && (value & (value - 1)) === 0;
    }

    public static radToDeg(radians: number): number {
        return radians * this.RAD2DEG;
    }

    public static degToRad(degrees: number): number {
        return degrees * this.DEG2RAD;
    }

    public static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    public static lerp(a: number, b: number, t: number): number {
        return a + (b - a) * Mathf.clamp01(t);
    }

    public static clamp01(value: number): number {
        return Mathf.clamp(value, 0, 1);
    }

    public static rotateAround(x: number, y: number, pivotX: number, pivotY: number, angle: number): Point {
        const rotated = this.rotatePoint(x - pivotX, y - pivotY, angle);
        return { x: rotated.x + pivotX, y: rotated.y + pivotY };
    }

    public static rotatePoint(x: number, y: number, angle: number): Point {
        const rad = this.degToRad(angle);
        return {
            x: x * Math.cos(rad) - y * Math.sin(rad),
            y: x * Math.sin(rad) + y * Math.cos(rad)
        };
    }

    public static distance(x1: number, y1: number, x2: number, y2: number): number {
        const dx = x2 - x1, dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    }
    //#endregion
}
