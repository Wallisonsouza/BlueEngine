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


// class Node<T> {

//     public value: T;
//     public next: Node<T> | null = null;

//     constructor(value: T) {
//         this.value = value;
//     }
// }

// class LinkedList<T> {

//     private head: Node<T> | null = null;

//     public add(value: T) {
//        const newNode: Node<T> = new Node<T>(value);

//         if(!this.head) {
//             this.head = newNode;
//             return;
//         }

//         let current: Node<T> = this.head;
//         while(current.next !== null) {
//             current = current.next;
//         }

//         current.next = newNode;
//     }

//     public print() {
//         let current: Node<T> | null = this.head;
//         if(!current){return};

//         while(current !== null) {
//             console.log(current.value);
//             current = current.next;
//         }
//     }

//     public inverse(){
//         let prev: Node<T> | null = null;
//         let current: Node<T> | null = this.head;
//         let next: Node<T> | null = null;

//         if(!current) return;

//         while(current !== null) {
//             next = current.next;
//             current.next = prev;
//             prev = current;
//             current = next;
//         }

//         this.head = prev;
//     }
// }

// const list = new LinkedList<number>();

// list.add(1);
// list.add(2);
// list.add(3);


// list.print();
// list.inverse();
// list.print();