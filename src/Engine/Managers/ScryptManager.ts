import MonoComportament from "../components/MonoComportament";

export default class ScryptManager {

    private static scrypts: Set<MonoComportament> = new Set();

    // Adiciona um novo scrypt ao Set
    public static addNewScrypt(scrypt: MonoComportament): void {
        if (scrypt instanceof MonoComportament) {
            this.scrypts.add(scrypt);
        }
    }

    // Retorna uma cópia da lista de scrypts
    public static getScrypts(): MonoComportament[] {
        return Array.from(this.scrypts);
    }
    
    // Chama o método awake de todos os scrypts
    public static awake(): void {
        this.scrypts.forEach(scrypt => scrypt.awake());
    }

    // Chama o método start de todos os scrypts
    public static start(): void {
        this.scrypts.forEach(scrypt => scrypt.start());
    }

    // Chama o método fixedUpdate de todos os scrypts
    public static fixedUpdate(): void {
        this.scrypts.forEach(scrypt => scrypt.fixedUpdate());
    }

    // Chama o método update de todos os scrypts
    public static update(): void {
        this.scrypts.forEach(scrypt => scrypt.update());
    }

    // Chama o método lateUpdate de todos os scrypts
    public static lateUpdate(): void {
        this.scrypts.forEach(scrypt => scrypt.lateUpdate());
    }

    // Chama o método onDrawGizmos de todos os scrypts
    public static onDrawGizmos(): void {
        this.scrypts.forEach(scrypt => scrypt.onDrawGizmos());
    }

    // Chama o método onGUI de todos os scrypts
    public static onGUI(): void {
        this.scrypts.forEach(scrypt => scrypt.onGUI());
    }
}
