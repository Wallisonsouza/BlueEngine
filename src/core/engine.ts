import { Main } from "../../game/logic/main";
import LifeCycleEvents from "./components/CallbackManager";
import Camera from "./components/Camera";
import Display from "./components/Display";
import RendMang from "./components/RenderManager";
import { loadDependencies } from "./EngineDependences";
import Input from "./input/Input";
import BufferManager from "./managers/BufferManager";
import MeshManager from "./managers/MeshManager";
import RendererManager from "./managers/RendererManager";
import SceneManager from "./managers/SceneManager";
import ShaderManager from "./managers/ShaderManager";
import RenderFrameBuffer from "./RenderTarget";
import IShadowCascade from "./Shadow";
import Shadow from "./Shadow";
import ShadowFrameBuffer from "./ShadowTarget";
import Time from "./Time";

export default class Engine {

    public static gl: WebGL2RenderingContext;
    private renderFrameBuffer: RenderFrameBuffer;
    private shadowFrameBuffer: ShadowFrameBuffer;

    private time: Time;

    constructor(API: WebGL2RenderingContext) {
        Engine.gl = API;
   
       
        this.time = new Time(
            this.awake.bind(this),
            undefined,
            this.update.bind(this),
            this.fixedUpdate.bind(this),
        );

        Display.applyResolution();
        this.renderFrameBuffer = new RenderFrameBuffer(API, Display.width, Display.height);
        this.shadowFrameBuffer = new ShadowFrameBuffer(API, 2048);
    }

    public init() {
        Main();

        LifeCycleEvents.on("update", () => {
            RendMang.collectRenderers();
        });
    }

    
    private awake() {
        LifeCycleEvents.emit("awake");
       
    }

    private fixedUpdate() {
       
    }

    private update(): void {
        Display.addLog(Time.fps.toString());
    
        const gl = Engine.gl;
        const camera = Camera.main;
        camera.aspectRatio = Display.getAspectRatio();
     
        if (this.renderFrameBuffer.width !== Display.width || this.renderFrameBuffer.height !== Display.height) {
        this.renderFrameBuffer.resize(Display.width, Display.height);
        }
    
        for (const shader of ShaderManager.getAllShaders()) {
            if (shader.setGlobalUniforms) shader.setGlobalUniforms();
        }
      
        this.shadowFrameBuffer.attach();
    
        this.renderFrameBuffer.attach();
        RendMang.renderObjects(gl, camera);
        this.renderFrameBuffer.detach();




        gl.clearColor(0, 0, 0, 1);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        const quadShader = ShaderManager.getShader("fullscreen")!;
        quadShader.use();
        quadShader.setSample2d("u_texture", this.renderFrameBuffer.texture);
        
        const squareMesh = MeshManager.getByName("square")!;
        const squareVAO = BufferManager.getVBO(squareMesh.id.value);
        gl.bindVertexArray(squareVAO);
        gl.drawElements(gl.TRIANGLES, squareMesh.triangles.length, squareMesh.indexDataType, 0);
        gl.bindVertexArray(null);
    
        // Atualizações da lógica do jogo
        LifeCycleEvents.emit("update");
        Input.clearInputs();
    }
    


    public async load() {
        await loadDependencies();

    }

    public start() {
        LifeCycleEvents.emit("start");
        Display.traceErrors = false;
        SceneManager.getCurrentScene();
        Display.traceErrors = true;
        this.time.start();
        Input.start();
    }

    public pause() {
        this.time.pause();
    }

    public resume() {
        this.time.resume();
    }

    public stop(): void {
        this.time.stop();
        console.info("Engine encerrada");
    }
}
