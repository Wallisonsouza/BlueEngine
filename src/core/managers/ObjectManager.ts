export class ObjectManager<T> {
    private objectsById: Map<number, T> = new Map();
    private objectsByName: Map<string, T> = new Map();
    private objectsByTag: Map<string, T[]> = new Map();
    private objectsByType: Map<string, T[]> = new Map();
    private objectsByGroup: Map<string, T[]> = new Map(); 

    private processId(id: number, obj: T): boolean {
        if (this.objectsById.has(id)) {
            console.error(`ID ${id} já está em uso. O objeto não será adicionado.`);
            return false;
        }
        this.objectsById.set(id, obj);
        return true;
    }

    private processTag(tag: string | undefined, obj: T): void {
        if (!tag) return;
        if (!this.objectsByTag.has(tag)) {
            this.objectsByTag.set(tag, []);
        }
        const list = this.objectsByTag.get(tag)!;
        if (!list.includes(obj)) list.push(obj);
    }

    private processName(name: string | undefined, obj: T): void {
        if (!name) return;
    
        // Verifica se o nome já está em uso
        let uniqueName = name;
        let index = 1;
        
        // Verifica e gera um nome único se necessário
        while (this.objectsByName.has(uniqueName)) {
           
            uniqueName = `${name}_${index}`;
            index++;
        }
       
        this.objectsByName.set(uniqueName, obj);
    }
    

    private processType(type: string | undefined, obj: T): void {
        if (!type) return;
        if (!this.objectsByType.has(type)) {
            this.objectsByType.set(type, []);
        }
        const list = this.objectsByType.get(type)!;
        if (!list.includes(obj)) list.push(obj);
    }

    private processGroup(group: string | undefined, obj: T): void {
        if (!group) return;
        if (!this.objectsByGroup.has(group)) {
            this.objectsByGroup.set(group, []);
        }
        const list = this.objectsByGroup.get(group)!;
        if (!list.includes(obj)) list.push(obj);
    }

    public addObject(id: number, obj: T, type?: string, name?: string, tag?: string, group?: string): boolean {
        if (!this.processId(id, obj)) return false;

        this.processTag(tag, obj);
        this.processName(name, obj);  // Agora processa o nome único
        this.processType(type, obj);
        this.processGroup(group, obj); // Adiciona o processamento do grupo

        return true;
    }

    public getObjects(): T[] {
        return Array.from(this.objectsById.values());
    }

    public getObjectById(id: number): T | undefined {
        return this.objectsById.get(id);
    }

    public getObjectsByName(name: string): T | undefined {
        return this.objectsByName.get(name);
    }

    public getObjectsByTag(tag: string): T[] {
        return this.objectsByTag.get(tag) ?? [];
    }

    public getObjectsByType(type: string): T[] {
        return this.objectsByType.get(type) ?? [];
    }

    public getObjectsByGroup(group: string): T[] {
        return this.objectsByGroup.get(group) ?? []; // Método para buscar por grupo
    }

    public removeObject(id: number): boolean {
        const obj = this.objectsById.get(id);
        if (!obj) return false;

        this.objectsById.delete(id);
        
        // Remove do mapa de nomes
        for (const [name, storedObj] of this.objectsByName.entries()) {
            if (storedObj === obj) {
                this.objectsByName.delete(name);
                break;
            }
        }

        // Remove do mapa de tags
        for (const list of this.objectsByTag.values()) {
            const index = list.indexOf(obj);
            if (index !== -1) list.splice(index, 1);
        }

        // Remove do mapa de tipos
        for (const list of this.objectsByType.values()) {
            const index = list.indexOf(obj);
            if (index !== -1) list.splice(index, 1);
        }

        // Remove do mapa de grupos
        for (const list of this.objectsByGroup.values()) {
            const index = list.indexOf(obj);
            if (index !== -1) list.splice(index, 1);
        }

        return true;
    }
}
