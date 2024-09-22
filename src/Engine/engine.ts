// import { importer } from "../Figma/importer";
import ScryptManager from "./Managers/ScryptManager";
import Time from "./static/Time";
import Input from "../Base/Input/Input";
import RendererManager from "./Managers/RendererManager";
import {WebGL2Api} from "./graphycs/Mesh";
import EngineCache from "./static/EngineCache";
import PhysicsManager from "./Managers/PhysicsManager";
import { DefaultValues } from "../main";
import { Shader } from "../Shader/Shader";
import { IRenderingApi } from "../global";
import ServiceLocator from "./graphycs/ServiceLocator";
import MeshBuilder from "./graphycs/MeshFactory";
import Camera from "../Inplementations/Camera";
import Material3D from "../Engine2D/Material/Material3D";

export default class Engine {

    private renderingAPI: IRenderingApi;
    private time: Time;

    fps: HTMLElement = document.getElementById("fps") as HTMLElement;

    constructor(API: IRenderingApi) {

        ServiceLocator.register('RenderingApi', API);
        ServiceLocator.register('ActiveCamera', Camera.main.camera);

        this.time = new Time(
            this.awake.bind(this),
            this.start.bind(this),
            this.update.bind(this),
            this.fixedUpdate.bind(this)
        );
        
        this.renderingAPI = API;
        EngineCache.setRenderingAPI(API);
        console.info("Engine criada com sucesso");
    }

    public async load(){

        try {
            await Promise.all([

                DefaultValues.shader2D = await Shader.createShaderAsync(
                    "/shaders/defaultShader2D.vert",
                    "/shaders/defaultShader2D.frag"
                ),
        
                DefaultValues.gizmosShader = await Shader.createShaderAsync(
                   "/shaders/defaultGizmosShader.vert",
                    "/shaders/defaultGizmosShader.frag"
                ),
        
                DefaultValues.lineShader2D = await Shader.createShaderAsync(
                    "/shaders/defaultLineShader.vert",
                    "/shaders/defaultLineShader.frag"
                ),
    
                DefaultValues.shader3D = await Shader.createShaderAsync(
                    "/shaders/defaultShader3D.vert",
                    "/shaders/defaultShader3D.frag"
                ),

            ]);
        } 
        catch (e) {
            console.error("erro no loader", e);
        }
       
       
        ServiceLocator.register("Shader3D", DefaultValues.shader3D);
        ServiceLocator.register('LineShader', DefaultValues.lineShader2D);
        ServiceLocator.register('CubeMesh', MeshBuilder.createCube());
        ServiceLocator.register('MainCamera', Camera.main.camera);
       
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

        this.fps.textContent = Time.fps.toString() + " fps";
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