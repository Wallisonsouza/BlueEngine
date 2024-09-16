export default class ServiceLocator {
    private static services: Map<string, any> = new Map();

    public static register<T>(name: string, service: T): void {
        this.services.set(name, service);
    }
  
    public static get<T>(name: string): T;
    public static get<T>(name: DefaultServicesLocator): T;
    
    public static get<T>(name: string | DefaultServicesLocator): T {
        const key = typeof name === 'string' ? name : name as DefaultServicesLocator;
        const service = this.services.get(key);
        if (!service) {
            throw new Error(`Serviço ${key} não está registrado.`);
        }
        return service;
    }
}

export enum DefaultServicesLocator {
    MainCamera = "MainCamera",
    CubeMesh = "CubeMesh",
    LineShader = "LineShader",
    Shader2D = "Shader2D",
    Shader3D = "Shader3D",
}
