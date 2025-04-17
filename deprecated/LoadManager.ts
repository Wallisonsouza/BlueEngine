// export default class LoadManager {
//     private static groups: Map<string, Promise<unknown>[]> = new Map();

//     public static registerGroup(name: string, promises: Promise<unknown>[]): void {
//         if (!Array.isArray(promises)) {
//             throw new TypeError("O parâmetro `promises` deve ser um array de promessas.");
//         }

//         if (this.groups.has(name)) {
//             this.groups.get(name)?.push(...promises);
//         } else {
//             this.groups.set(name, promises);
//         }
//     }

//     public static async awaitGroup(name: string): Promise<(unknown | null)[]> {
//         const promises = this.groups.get(name);

//         if (!promises) {
//             throw new Error(`Grupo "${name}" não encontrado.`);
//         }

//         return Promise.all(
//             promises.map(promise =>
//                 promise.catch(error => {
//                     console.error(`Erro na promessa do grupo "${name}":`, error);
//                     return null;
//                 })
//             )
//         );
//     }

//     public static clearGroup(name: string): boolean {
//         if (this.groups.delete(name)) {
//             console.info(`Grupo "${name}" removido com sucesso.`);
//             return true;
//         } else {
//             console.warn(`Grupo "${name}" não encontrado para remoção.`);
//             return false;
//         }
//     }

//     public static clearAll(): void {
//         this.groups.clear();
//         console.info("Todos os grupos foram removidos com sucesso.");
//     }

//     public static hasGroup(name: string): boolean {
//         return this.groups.has(name);
//     }

//     /**
//      * Carrega todos os grupos registrados e exibe a porcentagem de conclusão de cada um.
//      * @param onProgress Callback para monitorar o progresso dos grupos.
//      * @returns Um mapa com os resultados de cada grupo.
//      */
//     public static async loadAllGroups(
//         onProgress: (groupName: string, progress: number) => void
//     ): Promise<Map<string, (unknown | null)[]>> {
//         const results = new Map<string, (unknown | null)[]>();
//         const groupEntries = Array.from(this.groups.entries());

//         for (const [groupName, promises] of groupEntries) {
//             const totalPromises = promises.length;
//             let completedPromises = 0;

//             // Atualizar progresso para cada promessa individual
//             const trackedPromises = promises.map(promise =>
//                 promise
//                     .then(result => {
//                         completedPromises++;
//                         const progress = Math.floor((completedPromises / totalPromises) * 100);
//                         onProgress(groupName, progress);
//                         return result;
//                     })
//                     .catch(error => {
//                         console.error(`Erro na promessa do grupo "${groupName}":`, error);
//                         completedPromises++;
//                         const progress = Math.floor((completedPromises / totalPromises) * 100);
//                         onProgress(groupName, progress);
//                         return null;
//                     })
//             );

//             // Aguarda todas as promessas do grupo
//             const groupResults = await Promise.all(trackedPromises);
//             results.set(groupName, groupResults);
//         }

//         return results;
//     }
// }
