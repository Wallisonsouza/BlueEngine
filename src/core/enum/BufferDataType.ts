export const enum BufferDataType {
    BYTE = 0x1400,            // int8 (Int8Array) → Intervalo: -128 a 127
    UNSIGNED_BYTE = 0x1401,   // uint8 (Uint8Array) → Intervalo: 0 a 255
    
    SHORT = 0x1402,           // int16 (Int16Array) → Intervalo: -32.768 a 32.767
    UNSIGNED_SHORT = 0x1403,  // uint16 (Uint16Array) → Intervalo: 0 a 65.535
    
    INT = 0x1404,             // int32 (Int32Array) → Intervalo: -2.147.483.648 a 2.147.483.647
    UNSIGNED_INT = 0x1405,    // uint32 (Uint32Array) → Intervalo: 0 a 4.294.967.295
    
    FLOAT = 0x1406            // float32 (Float32Array) → Suporta números com ponto flutuante
}

interface TypeCheck {
    min: number;
    max: number;
    type: BufferDataType;
    check: (val: number) => boolean;
}

const types: TypeCheck[] = [
    { min: 0, max: 255, type: BufferDataType.UNSIGNED_BYTE, check: (val: number) => val >= 0 && val <= 255 },
    { min: 0, max: 65535, type: BufferDataType.UNSIGNED_SHORT, check: (val: number) => val >= 0 && val <= 65535 },
    { min: 0, max: 4294967295, type: BufferDataType.UNSIGNED_INT, check: (val: number) => val >= 0 && val <= 4294967295 },
    { min: -128, max: 127, type: BufferDataType.BYTE, check: (val: number) => val >= -128 && val <= 127 },
    { min: -32768, max: 32767, type: BufferDataType.SHORT, check: (val: number) => val >= -32768 && val <= 32767 },
    { min: -2147483648, max: 2147483647, type: BufferDataType.INT, check: (val: number) => val >= -2147483648 && val <= 2147483647 },
    { min: -Infinity, max: Infinity, type: BufferDataType.FLOAT, check: (val: number) => Number.isFinite(val) }
];

export function getType(arr: number[]): BufferDataType {
 
    if (arr.length === 0) {
        throw new Error("O array está vazio. Não é possível determinar o tipo.");
    }

    for (const { check, type } of types) {
        const isValid = arr.every(value => {
            if (type === BufferDataType.FLOAT) {
                return !Number.isInteger(value) && check(value); 
            }
            return Number.isInteger(value) && check(value); 
        });

        if (isValid) {
            return type;
        }
    }

    throw new Error(`Tipo de dados não identificado. O array fornecido foi: ${JSON.stringify(arr)}`);
}


