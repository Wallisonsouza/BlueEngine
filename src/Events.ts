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
}