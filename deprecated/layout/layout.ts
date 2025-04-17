import Debug from "../../engine/Debug";
import { GLBParser } from "../../plugins/glb/glbParser";
import Conversors from "../../plugins/GLTF/ConvertGltf";
import GLTFParser from "../../plugins/GLTF/GLTFLoader";
import GameObject from "../core/components/GameObject";
import SceneManager from "../core/managers/SceneManager";
import DropDown from "./components/dropdown/DropDown";

export function buildLayout() {

    // const worker = new Worker(new URL('../workers/worker.ts', import.meta.url), {
    //     type: 'module',
    // });
    
    // worker.onmessage = (event) => {
    //     const { type, data } = event.data;
        
    //     if (type === 'gltfConverted') {
    //         Conversors.toEngine3dObject(data, (gameObject) => {
    //             Debug.log("@color(#760085)[DEBUG]", "GameObject carregado:", gameObject.name);
    //             SceneManager.addGameObject(gameObject);
    //         }).then(() => {
    //             Debug.log("Carregamento concluído!");
    //         }).catch((error) => {
    //             console.error("Erro ao carregar GLTF:", error);
    //         });
    //     }
    // };
    
    // worker.onerror = (error) => {
    //     console.error('Erro no Worker:', error);
    // };


    // registerCommands();
    // createDebugConsole();


    const dropdown = new DropDown("File");
    document.getElementById("up-bar")?.appendChild(dropdown.element);

    dropdown.addOption("Import", "import");
    dropdown.addOption("Save", "save");

    function inportGLB() {
        const inputFile = document.createElement("input");
        inputFile.type = "file";
        inputFile.accept = ".glb"; 

        inputFile.onchange = (event) => {
            const file = (event.target as HTMLInputElement).files?.[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (loadEvent) => {
                    const binaryData = loadEvent.target?.result;
                    if (binaryData) {
                        const gltf = GLBParser.toGLTF(binaryData);
                        const parsedGflt = GLTFParser.parse(gltf);
                        
                        Conversors.toEngine3dObject(parsedGflt,
                            (object) =>{ 
                                SceneManager.addGameObject(object);
                            }
                        );
                       
                       
                    }
                };
                reader.readAsArrayBuffer(file);
            }
        };

        inputFile.click();
    }

    dropdown.onClick = (e) => { 
        if(e.value === "import") {
            inportGLB();
        }
    };

}