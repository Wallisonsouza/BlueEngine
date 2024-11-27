// import { importer } from "../Figma/importer";
import ScryptManager from "./managers/ScryptManager";
import Time from "./Time";
import Input from "./input/Input";
import RendererManager from "./managers/RendererManager";
import PhysicsManager from "./managers/PhysicsManager";
import { Shader } from "./graphics/shaders/Shader";
import { IRenderingApi } from "../global";
import ServiceLocator from "./factory/ServiceLocator";
import { BufferManager } from "./managers/BufferManager";
import { WebGL2Api } from "./graphics/mesh/WebGl2Api";
import MeshFactory from "./factory/MeshFactory";

export default class Engine {

    private renderingAPI: IRenderingApi;
    private time: Time;

    constructor(API: IRenderingApi) {

        ServiceLocator.register('RenderingApi', API);
     

        this.time = new Time(
            this.awake.bind(this),
            this.start.bind(this),
            this.update.bind(this),
            this.fixedUpdate.bind(this),
            undefined,
            this.onDrawnGizmos.bind(this)
            
        );
        
        this.renderingAPI = API;
        console.info("Engine criada com sucesso");
    }

   public async load(callbacks?: (() => Promise<void>)[]): Promise<void> {
    try {
        // Carregar shaders
        await Promise.all([
            
            Shader.createShaderAsync("src/core/graphics/shaders/defaultShader2D.vert", "src/core/graphics/shaders/defaultShader2D.frag", "2D"),
            Shader.createShaderAsync("src/core/graphics/shaders/default_vert_3D.vert", "src/core/graphics/shaders/default_frag_3D.frag", "3D"),
            Shader.createShaderAsync("src/core/graphics/shaders/defaultLineShader.vert", "src/core/graphics/shaders/defaultLineShader.frag", "Line"),
            Shader.createShaderAsync("src/core/graphics/shaders/defaultGizmosShader.vert", "src/core/graphics/shaders/defaultGizmosShader.frag", "Gizmos")
        ]);

        // Criando e registrando as malhas
        const cubeMesh = MeshFactory.createCube();
        ServiceLocator.register('CubeMesh', cubeMesh);

        const sphereMesh = MeshFactory.createSphere(1, 16, 16);
        ServiceLocator.register('SphereMesh', sphereMesh);

        // Registrando buffers para WebGL2
        if (this.renderingAPI instanceof WebGL2Api) {
            BufferManager.registerMesh(cubeMesh);
            BufferManager.registerMesh(sphereMesh);
        }

        if(!callbacks) {return};

        const totalCallbacks = callbacks.length; 
            let completedCallbacks = 0;

            const updateProgress = () => {
                const percentage = Math.floor((completedCallbacks / totalCallbacks) * 100);
                console.info(`Progresso de carregamento: ${percentage}%`);
            };

            try {
              
                for (const callback of callbacks) {
                    await callback();
                    completedCallbacks++;
                    updateProgress(); 
                }

                console.info("Carregamento concluído!");
            } catch (e) {
                console.error("Erro no carregamento:", e);
            }

    } catch (e) {
        console.error("Erro no carregamento:", e);
    }
}

    public getRenderingAPI(): IRenderingApi | null {
        return this.renderingAPI;
    }
    
    public initialize() {
        
        this.time.start();

        if(!this.renderingAPI) {
            throw new Error("A engine nao possui nenhuma API para renderizar");

        }
        else if (this.renderingAPI instanceof WebGL2Api){
            console.info("Engine inicializada com sucesso, usando API WebGl2");
        }
    }

    private awake(){
        ScryptManager.awake();
    }

    private start(): void {
        Input.start();
        ScryptManager.start();
    }   

    private fixedUpdate(){
        ScryptManager.fixedUpdate();
        PhysicsManager.fixedUpdate();
    }

    private update(): void {
        RendererManager.update();
        ScryptManager.update();
        Input.clearInputs();
    }
    
    public onDrawnGizmos(): void {
        ScryptManager.onDrawGizmos();
    }

    public pause(){
        this.time.pause();
    }

    public resume(){
        this.time.resume();
    }
    
    public stop(): void {
        this.time.stop();
        console.info("Engine encerrada");
    }
}