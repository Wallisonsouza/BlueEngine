import { WindowScreen } from "./main";

export default class Events {
    public static addBlockResizeEvent() {
        window.addEventListener("wheel", (event) => {
            if(event.ctrlKey) {
                event.preventDefault();
            }
            
        }, {passive: false});
        
        window.addEventListener("gesturestart", function(event) {
            event.preventDefault();
        });
        
        window.addEventListener("gesturechange", function(event) {
            event.preventDefault();
        });
        
        window.addEventListener("gesture", function(event) {
            event.preventDefault();
        });
        
        window.addEventListener("contextmenu", (e) => {
            e.preventDefault();
        });
    }

    public static addCanvasResizeEvent(canvas: HTMLCanvasElement){

        window.addEventListener("resize", () => {
            this.resize(canvas, window.innerWidth, window.innerHeight);
            WindowScreen.setDimensions(canvas.width, canvas.height);
        })
        this.resize(canvas, window.innerWidth, window.innerHeight);
       
    }

    private static resize(canvas: HTMLCanvasElement, width: number, height: number){
        canvas.width = width;
        canvas.height = height;
    }
}