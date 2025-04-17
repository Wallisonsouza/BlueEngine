import Engine from "./core/engine";
import Events from "./Events";
import Display from "./core/components/Display";

//#region CONFIG
    const canvas = document.getElementById("canvas") as HTMLCanvasElement;
    if (!canvas) {
        console.error("Elemento canvas não encontrado.");
    }

    const gl = canvas.getContext("webgl2", {
        stencil: true,
        depth: true,
        alpha: true,
        desynchronized: false,
        preserveDrawingBuffer: true,
        powerPreference: "high-performance",
    }) as WebGL2RenderingContext;

    if (!gl) {
        console.error("Não foi possível obter o contexto WebGL2.");
    }

    Display.webGl = gl;
    window.addEventListener("resize", ()=>{ Display.applyResolution() });
    Events.addBlockResizeEvent();

//#endregion


// Cria uma nova instância da engine, passando o contexto WebGL
const engine = new Engine(gl);

// Carrega todos os recursos necessários para o funcionamento da engine, incluindo texturas, modelos e outros dados essenciais.
await engine.load();

// Inicializa a engine, configurando e carregando shaders, meshes e outros componentes fundamentais para o ciclo de renderização.
engine.init();

// Inicia o ciclo contínuo de renderização, no qual a cena será atualizada e renderizada a cada quadro (frame) para proporcionar a experiência visual interativa.
engine.start();
