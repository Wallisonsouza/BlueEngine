import Vector2 from "../math/Vector2";
import Vector3 from "../math/Vector3";

export default class Display {
    
    public static webGl: WebGL2RenderingContext;
    private static _width: number = 0;
    private static _height: number = 0; 
    private static element = document.getElementById("debug") as HTMLDivElement;
    public static traceErrors = true;

    public static addError(error: Error) {
        if (this.traceErrors) {
            const stackLines = error.stack?.trim().split("\n") || [];
            // Garantir que há pelo menos 2 linhas na stack
            if (stackLines.length < 2) {
                this.element.innerText = "Erro desconhecido. Stack trace insuficiente.";
                return;
            }
    
            // Extração do início do erro
            const start = this.extractFunctionAndFile(stackLines[1]);
            if (!start.fileName || !start.functionName) {
                this.element.innerText = "Erro com stack trace inválido.";
                return;
            }
            const fileNameStart = start.fileName || "arquivo desconhecido";
            const functionNameStart = start.functionName || "função desconhecida";
    
            // Extração do último local antes do erro ser capturado
           
            const end = this.extractFunctionAndFile(stackLines[2]);
            const fileNameEnd = end.fileName || "arquivo desconhecido";
            const functionNameEnd = end.functionName || "função desconhecida";
    
            // Exibição personalizada da mensagem de erro
            if (start.fileName === end.fileName && start.functionName === end.functionName) {
                this.element.innerText = 
                `Error detected:
    
                Message: ${error.message}
                Error Type: ${error.name}
                Origin: ${fileNameStart} → ${functionNameStart}
                Last reference: main`;
            } else {
                this.element.innerText = 
                `Error detected:
    
                Message: ${error.message}
                Error Type: ${error.name}
                Origin: ${fileNameStart} → ${functionNameStart}
                Last reference: ${fileNameEnd} → ${functionNameEnd}`;
            }
        } else {
            this.element.innerText = "ℹ️ " + error.message;
        }
    }
    
    

    private static extractFunctionAndFile(stackLine: string): { functionName: string | null, fileName: string | null } {
        if (!stackLine) return { functionName: null, fileName: null };
    
        // Regex ajustado para capturar funções com nomes compostos, como "get main"
        const match = stackLine.match(/^([a-zA-Z0-9_\-\s]+)@.+\/([^\/?]+)(?:\?|:)/);
    
        if (!match) return { functionName: null, fileName: null };
    
        return {
            functionName: match[1]?.trim(),  // Remover espaços extras, se houver
            fileName: match[2]  
        };
    }
    
    
    
    public static get width() {
        return Display._width;
    }
    public static get height() {
        return Display._height;
    }

    public static setDimensions(width: number, height: number): void {
        this._width = width;
        this._height = height;
    }
    public static getDimensions() {
       return new Vector2(this._width, this._height);
    }

    public static getAspectRatio() {
        return this._width / this._height;
    }
    public static screenToNDC(screenPoint: Vector3): Vector3 {
        if (this._width === 0 || this._height === 0) {
            throw new Error("WindowScreen dimensions are not set.");
        }
        const x_ndc = (2 * screenPoint.x / this._width) - 1;
        const y_ndc = 1 - (2 * screenPoint.y / this._height);
        return new Vector3(x_ndc, y_ndc, screenPoint.z);
    }

    
    public static applyResolution(): void {
       this.setResolution(window.innerWidth, window.innerHeight)
    }
    
    public static setResolution(width: number, height: number) {

        const canvas = this.webGl.canvas as HTMLCanvasElement;

        canvas.width = width;
        canvas.height = height;
        const rect = canvas.getBoundingClientRect();
        Display.setDimensions(rect.width, rect.height);
        this.webGl.viewport(0, 0, this.webGl.drawingBufferWidth, this.webGl.drawingBufferHeight);
    }
    
  
}
