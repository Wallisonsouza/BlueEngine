// import Matrix4x4 from "../math/Matrix4x4";

// class TransformCache {
//     private static cache: Map<number, Matrix4x4> = new Map();

//     // Obtém a matriz de transformação do cache
//     public static getCachedModelMatrix(transformId: number): Matrix4x4 | null {
//         return this.cache.get(transformId) ?? null;
//     }

//     // Define a matriz de transformação no cache
//     public static setCachedModelMatrix(transformId: number, modelMatrix: Matrix4x4): void {
//         this.cache.set(transformId, modelMatrix);
//     }

//     // Limpa o cache inteiro
//     public static clearCache(): void {
//         this.cache.clear();
//     }

//     // Apaga o cache de um Transform específico pelo seu ID
//     public static removeCacheById(transformId: number): void {
//         if (this.cache.has(transformId)) {
//             this.cache.delete(transformId);
//             console.log(`Cache do Transform com ID ${transformId} foi apagado.`);
//         } else {
//             console.log(`Nenhum cache encontrado para o Transform com ID ${transformId}.`);
//         }
//     }
// }

// export default TransformCache;
