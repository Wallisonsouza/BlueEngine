import Vector3 from "../../math/Vector3";
import Transform from "../Transform";

export default class Bounds {
    private _min: Vector3 | null = null;
    private _max: Vector3 | null = null;
    private _corners: Vector3[] | null = null; 


    constructor(
        public center: Vector3, 
        public size: Vector3
    ) {
        this.min;
        this.max;
        this.getCorners();
    }

    public get extents(): Vector3 {
        return this.size.scale(0.5);
    }

    public get min(): Vector3 {
        if (!this._min) {
            this._min = this.center.subtract(this.extents);
        }
        return this._min;
    }

    public get max(): Vector3 {
        if (!this._max) {
            this._max = this.center.add(this.extents);
        }
        return this._max;
    }

    // Expande o Bounds aumentando seu tamanho em todas as direções
    public expand(amount: number): void {
        this.size.x += amount;
        this.size.y += amount;
        this.size.z += amount;
        // Limpar os caches de min, max e corners, pois eles dependem do tamanho
        this._min = null;
        this._max = null;
        this._corners = null;
    }

    // Verifica se um ponto está dentro dos limites do Bounds
    public contains(point: Vector3): boolean {
        const min = this.min; // Acessa o valor calculado de min
        const max = this.max; // Acessa o valor calculado de max

        return (
            point.x > min.x && point.x < max.x &&
            point.y > min.y && point.y < max.y &&
            point.z > min.z && point.z < max.z
        );
    }

    // Verifica se outro Bounds está dentro deste Bounds
    public containsBounds(other: Bounds): boolean {
        const min = this.min;
        const max = this.max;
        const otherMin = other.min;
        const otherMax = other.max;

        return (
            otherMin.x >= min.x && otherMax.x <= max.x &&
            otherMin.y >= min.y && otherMax.y <= max.y &&
            otherMin.z >= min.z && otherMax.z <= max.z
        );
    }

    // Verifica se o Bounds atual se sobrepõe a outro Bounds
    public intersects(other: Bounds): boolean {
        const min = this.min;
        const max = this.max;
        const otherMin = other.min;
        const otherMax = other.max;

        return (
            min.x <= otherMax.x && max.x >= otherMin.x &&
            min.y <= otherMax.y && max.y >= otherMin.y &&
            min.z <= otherMax.z && max.z >= otherMin.z
        );
    }

    // Calcula o volume do Bounds
    public volume(): number {
        return this.size.x * this.size.y * this.size.z;
    }

    // Método que retorna a união entre dois Bounds
    public union(other: Bounds): Bounds {
        const minX = Math.min(this.min.x, other.min.x);
        const minY = Math.min(this.min.y, other.min.y);
        const minZ = Math.min(this.min.z, other.min.z);
        
        const maxX = Math.max(this.max.x, other.max.x);
        const maxY = Math.max(this.max.y, other.max.y);
        const maxZ = Math.max(this.max.z, other.max.z);
        
        const newCenter = new Vector3((minX + maxX) / 2, (minY + maxY) / 2, (minZ + maxZ) / 2);
        const newSize = new Vector3(maxX - minX, maxY - minY, maxZ - minZ);

        return new Bounds(newCenter, newSize);
    }

    // Aplica uma transformação ao Bounds
    public applyTransformation(t: Transform): void {
        this.center = t.position;
        this.size = this.size.multiply(t.scale);

        this._min = null;
        this._max = null;
        this._corners = null;
    }

    // Método otimizado que retorna os 8 cantos da AABB, com cache
    public getCorners(): Vector3[] {
        // Verifica se o cache já está disponível
        if (!this._corners) {
            const min = this.min;
            const max = this.max;
            this._corners = [
                new Vector3(min.x, min.y, min.z), // Ponto 0
                new Vector3(max.x, min.y, min.z), // Ponto 1
                new Vector3(min.x, max.y, min.z), // Ponto 2
                new Vector3(max.x, max.y, min.z), // Ponto 3
                new Vector3(min.x, min.y, max.z), // Ponto 4
                new Vector3(max.x, min.y, max.z), // Ponto 5
                new Vector3(min.x, max.y, max.z), // Ponto 6
                new Vector3(max.x, max.y, max.z), // Ponto 7
            ];
        }

        return this._corners;
    }
}
