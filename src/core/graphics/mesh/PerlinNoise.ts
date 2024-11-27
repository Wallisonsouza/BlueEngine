export default class PerlinNoise {
    private perm: number[];
    private seed: number;

    constructor(seed: number = 0) {
        this.seed = seed;
        this.perm = this.generatePermutation();
    }

    // Função para gerar um valor pseudo-aleatório baseado na seed
    private random(seed: number): number {
        const x = Math.sin(seed) * 10000;
        return x - Math.floor(x);
    }

    // Geração da permutação para o algoritmo de Perlin Noise
    private generatePermutation(): number[] {
        let perm = [];
        for (let i = 0; i < 256; i++) {
            perm[i] = i;
        }
        // Embaralha os números da permutação com base na seed
        for (let i = 255; i > 0; i--) {
            const j = Math.floor(this.random(i + this.seed) * (i + 1));
            [perm[i], perm[j]] = [perm[j], perm[i]];
        }
        return perm.concat(perm); // Duplicando a permutação para facilitar a interpolação
    }

    // Função de interpolação (suavização) do Perlin Noise
    private fade(t: number): number {
        return t * t * t * (t * (t * 6 - 15) + 10);
    }

    // Função para calcular o gradiente para 3D
    private grad(hash: number, x: number, y: number, z: number): number {
        const h = hash & 15;
        const u = h < 8 ? x : y;  // Se o valor do hash é menor que 8, use 'x', caso contrário use 'y'
        const v = h < 4 ? y : (h === 12 || h === 14 ? x : z);
        return ((h & 1 ? -1 : 1) * (u + v));  // Sinal positivo ou negativo dependendo do hash
    }


    public noise(x: number, y: number, z: number): number {
    
        const X = Math.floor(x) & 255;
        const Y = Math.floor(y) & 255;
        const Z = Math.floor(z) & 255;
    
        const xf = x - Math.floor(x);
        const yf = y - Math.floor(y);
        const zf = z - Math.floor(z);
    
        const u = this.fade(xf);
        const v = this.fade(yf);
        const w = this.fade(zf);
    
        const aaa = this.perm[X + this.perm[Y + this.perm[Z]]];
        const aab = this.perm[X + this.perm[Y + this.perm[Z + 1]]];
        const aba = this.perm[X + this.perm[Y + 1 + this.perm[Z]]];
        const abb = this.perm[X + this.perm[Y + 1 + this.perm[Z + 1]]];
        const baa = this.perm[X + 1 + this.perm[Y + this.perm[Z]]];
        const bab = this.perm[X + 1 + this.perm[Y + this.perm[Z + 1]]];
        const bba = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z]]];
        const bbb = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]];
    
        const x1 = this.lerp(
            this.grad(aaa, xf, yf, zf),
            this.grad(baa, xf - 1, yf, zf),
            u
        );
        const x2 = this.lerp(
            this.grad(aba, xf, yf - 1, zf),
            this.grad(bba, xf - 1, yf - 1, zf),
            u
        );
        const y1 = this.lerp(x1, x2, v);
    
        const x3 = this.lerp(
            this.grad(aab, xf, yf, zf - 1),
            this.grad(bab, xf - 1, yf, zf - 1),
            u
        );
        const x4 = this.lerp(
            this.grad(abb, xf, yf - 1, zf - 1),
            this.grad(bbb, xf - 1, yf - 1, zf - 1),
            u
        );
        const y2 = this.lerp(x3, x4, v);
    
        return this.lerp(y1, y2, w);
    }

    // Interpolação linear
    private lerp(a: number, b: number, t: number): number {
        return a + t * (b - a);
    }

    // Gerar um terreno com Fractal Brownian Motion (FBM) em 3D
    public generateFBM(x: number, y: number, z: number, octaves: number = 4, persistence: number = 0.5, scale: number = 1): number {
        let total = 0;
        let frequency = scale;
        let amplitude = 1;
        let maxValue = 0;  // Para normalizar o resultado final

        for (let i = 0; i < octaves; i++) {
            total += this.noise(x * frequency, y * frequency, z * frequency) * amplitude;
            maxValue += amplitude;
            amplitude *= persistence;
            frequency *= 2;
        }

        // Normalizar para o intervalo [0, 1]
        return total / maxValue;
    }
}
