export default class Mathf {

    public static readonly INFINITY = Infinity;
    public static readonly PI = Math.PI;
    public static readonly PI2 = Math.PI * 2;
    public static readonly PI_HALF = Math.PI / 2;
    public static readonly PI_QUARTER = Math.PI / 4;
    public static readonly RAD2DEG = 180 / Math.PI;
    public static readonly DEG2RAD = Math.PI / 180;

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

    public static lerp(a: number, b: number, t: number): number {
        t = Mathf.clamp01(t);
        return a + (b - a) * t;
    }

    public static lerpUnclamped(a: number, b: number, t: number): number {
        return a + (b - a) * t;
    }

    public static smoothStep(edge0: number, edge1: number, x: number): number {
        let t = Mathf.clamp01((x - edge0) / (edge1 - edge0));
        return t * t * (3 - 2 * t);
    }

    public static mapRange(value: number, inMin: number, inMax: number, outMin: number, outMax: number): number {
        return outMin + (value - inMin) * (outMax - outMin) / (inMax - inMin);
    }

    public static mod(a: number, b: number): number {
        return a - b * Math.floor(a / b);
    }

    public static fmod(a: number, b: number): number {
        return a - b * Math.floor(a / b);
    }

    public static isEven(value: number): boolean {
        return value % 2 === 0;
    }

    public static isOdd(value: number): boolean {
        return value % 2 !== 0;
    }

    public static factorial(n: number): number {
        if (n <= 1) return 1;
        return n * Mathf.factorial(n - 1);
    }

    public static lerpAngle(a: number, b: number, t: number): number {
        let delta = Mathf.normalizeAngle(b - a);
        return a + delta * t;
    }

    public static normalizeAngle(angle: number): number {
        return (angle + Math.PI) % (2 * Math.PI) - Math.PI;
    }

    public static clamp(value: number, min: number, max: number): number {
        return Math.min(Math.max(value, min), max);
    }

    public static clamp01(value: number): number {
        return Mathf.clamp(value, 0, 1);
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

    public static randomRange(min: number, max: number): number {
        if (min > max) {
            throw new Error("O valor mínimo não pode ser maior que o valor máximo");
        }
        return Math.random() * (max - min) + min;
    }

    public static linearToAngular(linear: number, radius: number): number {
        return linear / radius;
    }

    public static msToKmh(ms: number): number {
        return ms * 3.6;
    }

    public static milesToKilometers(miles: number): number {
        return miles * 1.60934;
    }

    public static kilometersToMiles(km: number): number {
        return km / 1.60934;
    }

    public static celsiusToFahrenheit(celsius: number): number {
        return (celsius * 9/5) + 32;
    }

    public static fahrenheitToCelsius(fahrenheit: number): number {
        return (fahrenheit - 32) * 5/9;
    }

    public static celsiusToKelvin(celsius: number): number {
        return celsius + 273.15;
    }

    public static kelvinToCelsius(kelvin: number): number {
        return kelvin - 273.15;
    }

    public static fahrenheitToKelvin(fahrenheit: number): number {
        return (fahrenheit - 32) * 5/9 + 273.15;
    }

    public static kelvinToFahrenheit(kelvin: number): number {
        return (kelvin - 273.15) * 9/5 + 32;
    }

    public static metersToCentimeters(meters: number): number {
        return meters * 100;
    }

    public static centimetersToMeters(cm: number): number {
        return cm / 100;
    }

    public static gramsToKilograms(grams: number): number {
        return grams / 1000;
    }

    public static kilogramsToGrams(kgs: number): number {
        return kgs * 1000;
    }

    public static poundsToKilograms(pounds: number): number {
        return pounds * 0.453592;
    }

    public static kilogramsToPounds(kgs: number): number {
        return kgs / 0.453592;
    }

    public static litersToMilliliters(liters: number): number {
        return liters * 1000;
    }

    public static millilitersToLiters(ml: number): number {
        return ml / 1000;
    }

    public static chooseTypedArray(arr: number[]): 
        Float32Array | Uint8Array | Uint16Array | Uint32Array | Int8Array | Int16Array | Int32Array {

        let hasFloat = false;
        let max = -Infinity;
        let min = Infinity;

        for (const num of arr) {
            if (!Number.isInteger(num)) {
                hasFloat = true;
            }
            if (num > max) max = num;
            if (num < min) min = num;
        }

        if (hasFloat) {
            return new Float32Array(arr); 
        }

        if (min >= 0) {
            if (max <= 255) return new Uint8Array(arr);
            if (max <= 65535) return new Uint16Array(arr);
            return new Uint32Array(arr);
        } else {
            if (min >= -128 && max <= 127) return new Int8Array(arr);
            if (min >= -32768 && max <= 32767) return new Int16Array(arr);
            return new Int32Array(arr);
        }
    }

    
    
}
