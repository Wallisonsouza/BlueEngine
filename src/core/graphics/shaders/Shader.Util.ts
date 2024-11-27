export default class ShaderUtil {
   
    private static createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
        try {
            const shader = gl.createShader(type);
            if (!shader) {
                throw new Error(`Failed to create shader of type ${type}`);
            }
    
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
    
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                const errorMsg = gl.getShaderInfoLog(shader);
                gl.deleteShader(shader);
                throw new Error(`Shader compile error: ${errorMsg}`);
            }
    
            return shader; 
        } catch (error) {
            console.error("Shader creation error:", error);
            return null;
        }
    }

    public static createVertexShader(gl: WebGLRenderingContext, source: string): WebGLShader | null {
        let vertShader = ShaderUtil.createShader(gl, gl.VERTEX_SHADER, source);

        if (!vertShader) {
            console.warn("Failed to create vertex shader, using default shader.");

        }
   
        return vertShader;
    }

    public static createFragmentShader(gl: WebGLRenderingContext, source: string): WebGLShader | null {
        let fragShader = ShaderUtil.createShader(gl, gl.FRAGMENT_SHADER, source);

        if (!fragShader) {
            console.warn("Failed to create fragment shader, using default shader.");
          
        }

        return fragShader;
    }

    public static createProgram(gl: WebGLRenderingContext, vertexShaderSource: string, fragmentShaderSource: string): WebGLProgram | null {
        try {
            const vertexShader = ShaderUtil.createVertexShader(gl, vertexShaderSource);
            const fragmentShader = ShaderUtil.createFragmentShader(gl, fragmentShaderSource);

            if (!vertexShader || !fragmentShader) {
                throw new Error("Failed to create one or both shaders");
            }
           
            const program = gl.createProgram();
            if (!program) {
                throw new Error("Failed to create WebGL program");
            }

            gl.attachShader(program, vertexShader);
            gl.attachShader(program, fragmentShader);

            gl.linkProgram(program);

            if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
                const errorMsg = gl.getProgramInfoLog(program);
                gl.deleteProgram(program);
                throw new Error(`Program link error: ${errorMsg}`);
            }

            return program;
        } catch (error) {
            console.error("Program creation error:", error);
            return null;
        }
    }
}