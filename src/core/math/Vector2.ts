export default class Vector2 {

    public x: number;
    public y: number;
    
    
    constructor(x: number = 0, y: number = 0){
        this.x = x;
        this.y = y;
    }

    public static readonly SIZE = 2;
    public static readonly ONE = new Vector2(1, 1);
    public static readonly ZERO = new Vector2(0, 0);

    public toArray(){
        return [this.x, this.y]
    }
    public clone(){
        return new Vector2(this.x, this.y);
    }

    scale(factor: number): Vector2 {
        return new Vector2(this.x * factor, this.y * factor);
    }

    add(vec: Vector2): Vector2 {
        return new Vector2(this.x + vec.x, this.y + vec.y);
    }

    public static arrayToF32Array(v: Vector2[]): Float32Array {
        const float32Array = new Float32Array(v.length * 2);
        v.forEach((v, index) => {
            float32Array[index * 2] = v.x;
            float32Array[index * 2 + 1] = v.y;
        });

        return float32Array;
    }

    public subtract(v: Vector2): Vector2 {
        return new Vector2(this.x - v.x, this.y - v.y);
    }

    // Conversão de Float32Array para array de Vector2
    public static fromF32Array(data: Float32Array): Vector2[] {
        const vectors: Vector2[] = [];
        for (let i = 0; i < data.length; i += 2) {
            vectors.push(new Vector2(data[i], data[i + 1]));
        }
        return vectors;
    }
}