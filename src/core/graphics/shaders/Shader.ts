import Matrix4x4 from "../../math/Matrix4x4";
import ShaderUtil from "./Shader.Util";
import Vector2 from "../../math/Vector2";
import Vector3 from "../../math/Vector3";
import Engine from "../../engine";
import Display from "../../components/Display";

export default class Shader {

    private vertSource: string;
    private fragSource: string;
    public name: string = "";
    public setGlobalUniforms?: () => void;

    constructor(name: string = "New Shader", vertSource: string = "", fragSource: string = ""){
        this.vertSource = vertSource;
        this.fragSource = fragSource;
        this.name = name;
        this.compile();
    }
 
    public program: WebGLProgram | null = null;
    private uniforms: Map<string, number> = new Map();


    public onPreRender() {
        
    }
   
    public setFragSource(source: string): void {
        this.fragSource = source;
    }
   
    public setVertSource(source: string): void {
        this.vertSource = source;
    }

    setUniform(name: string, value: any) {
        this.uniforms.set(name, value);
    }

 
    public compile(): void {

        const gl = Display.webGl;
        this.program = ShaderUtil.createProgram(gl, this.vertSource, this.fragSource);
        if (!this.program) {
            throw new Error("Falha ao criar o programa de shaders.");
        }

        this.use();
    }

    public use(): void {
        const gl = Display.webGl;
        gl.useProgram(this.program);
    }

    public deactivate(): void {
        const gl = Display.webGl;
        gl.useProgram(null);
    }

    public setVec3(name: string, values: Float32Array | number[] | Vector3) {
        const location = this.getUniformLocation(name);
    
        if (location) {
          
            if (!(values instanceof Float32Array)) {
                if (Array.isArray(values)) {
                    values = new Float32Array(values);
                } else if (values instanceof Vector3) {
                    values = new Float32Array([values.x, values.y, values.z]);
                }
            }
            const gl = Display.webGl;
            gl.uniform3fv(location, values);
        } 
    }

    public setUniform2fv(name: string, values: Float32Array | number[] | Vector2): void {
        const location = this.getUniformLocation(name);
    
        if (location) {
          
            if (!(values instanceof Float32Array)) {
                if (Array.isArray(values)) {
                    values = new Float32Array(values);
                } else if (values instanceof Vector2) {
                    values = new Float32Array([values.x, values.y]);
                }
            }
            const gl = Display.webGl;
            gl.uniform2fv(location, values);
        } 
    }

    public setInt(name: string, value: number){
        const location = this.getUniformLocation(name);
        if(location){
            const gl = Display.webGl;
            gl.uniform1i(location, value);
        }
    }
    public setFloat(name: string, value: number){
        const location = this.getUniformLocation(name);
        if(location){
            const gl = Display.webGl;
            gl.uniform1f(location, value);
        }
    }


    public setUniformBuffer(buffer: WebGLBuffer, name: string, bindingPoint: number) {
        const blockIndex = this.getUniformBlockIndex(name);
        const gl = Display.webGl;
        // Associa o bloco ao ponto de ligação especificado
        gl.uniformBlockBinding(this.program, blockIndex, bindingPoint);
    
        // Vincula o buffer ao ponto de ligação
        gl.bindBufferBase(gl.UNIFORM_BUFFER, bindingPoint, buffer);
    }

    public defineBinding(name: string, bindingPoint: number) {

        const gl = Display.webGl;
        const blockIndex = this.getUniformBlockIndex(name);
        gl.uniformBlockBinding(this.program, blockIndex, bindingPoint);
  
    }
    

    public setMat4(name: string, matrix: Matrix4x4, transpose: boolean = false): void {
        const location = this.getUniformLocation(name);
        if (location) {
            const gl = Display.webGl;
            gl.uniformMatrix4fv(location, transpose, matrix.getData());  
        }
    }
    
    public setUniform4f(name: string, x: number, y: number, z: number, w: number) {
        const location = this.getUniformLocation(name);
        if (location) {
            const gl = Display.webGl;
            gl.uniform4f(location, x, y, z, w);
        }
    }

    public setVec4(name: string, value: number[]) {
        const location = this.getUniformLocation(name);
        if (location) {
            const gl = Display.webGl;
            gl.uniform4fv(location, value);
        }
    }

    public setSample2d(name: string, texture: WebGLTexture, textureUnit: number = 0) {
        const location = this.getUniformLocation(name);
        if (location === null) {
            console.error(`Uniform location for ${name} not found.`);
            return;
        }
        const gl = Display.webGl;
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(location, textureUnit);
    }

    public unbindSampler2d(textureUnit: number = 0) {
        const gl = Display.webGl;
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
        gl.bindTexture(gl.TEXTURE_2D, null);
    }

    public setSampleCube(name: string, texture: WebGLTexture | null, textureUnit: number = 0) {
        const location = this.getUniformLocation(name);
        if (location === null) {
            console.error(`Erro no shader '${this.name}': localização do uniforme '${name}' não encontrada ao definir o sampler cube.`);
            return;
        }
    
        const gl = Display.webGl;
        if (!gl) {
            console.error(`Erro no shader '${this.name}': o contexto WebGL não foi inicializado ao definir o sampler cube.`);
            return;
        }
    
        gl.activeTexture(gl.TEXTURE0 + textureUnit);
    
        if (texture) {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
        } else {
            gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
        }

        gl.uniform1i(location, textureUnit);
    }
    
    
    

    private withGlAndProgram<T>(callback: (gl: WebGLRenderingContext, program: WebGLProgram) => T | null): T | null {
        const gl = Display.webGl;
        if (!gl) {
            console.error("WebGL context não disponível.");
            return null;
        }

        if (!this.program) {
            console.error("Programa do shader não disponível.");
            return null;
        }

        return callback(gl, this.program);
    }

    public getAttributeLocation(name: string): number | null {
        return this.withGlAndProgram((gl, program) => {
            if (this.uniforms.has(name)) {
                return this.uniforms.get(name)!;
            }

            const location = gl.getAttribLocation(program, name);
            if (location === -1) {
                console.error(`Não foi possível encontrar o atributo '${name}' no shader.`);
                return null;
            }

            this.uniforms.set(name, location);
            return location;
        });
    }

    private uniformCache: Map<string, {location: WebGLUniformLocation | null, error: boolean}> = new Map();
    public getUniformLocation(name: string): WebGLUniformLocation | null {
        // Valida se o contexto WebGL e o programa de shader são válidos
        const gl = Display.webGl;
        if (!gl || !this.program) {
            console.error("O contexto WebGL ou o programa de shader não são válidos.");
            return null;
        }

        // Verifica se o uniforme já foi cacheado e se ocorreu erro na busca
        const cachedUniform = this.uniformCache.get(name);
        if (cachedUniform) {
            if (cachedUniform.error) {
                console.debug(`Busca para o uniforme '${name}' está bloqueada devido a falhas anteriores.`);
                return null;
            }
            return cachedUniform.location;
        }

        // Tenta buscar a localização do uniforme no programa de shader
        const location = gl.getUniformLocation(this.program, name);

        // Caso não consiga encontrar, registra a falha e bloqueia futuras tentativas
        if (!location) {
            console.error(`Falha ao encontrar o uniforme '${name}' no shader.`);
            // Armazena no cache com erro
            this.uniformCache.set(name, { location: null, error: true });
            return null;
        }

        // Cacheia a localização encontrada para otimizar buscas futuras
        this.uniformCache.set(name, { location, error: false });
        return location;
    }


    private uniformBlockCache: Map<string, {location: number | null, error: boolean}> = new Map();
    public getUniformBlockIndex(name: string): number | null {
        // Valida se o contexto WebGL e o programa de shader são válidos
        const gl = Display.webGl;
        if (!gl || !this.program) {
            console.error("O contexto WebGL ou o programa de shader não são válidos.");
            return null;
        }
    
        // Verifica se o uniforme já foi cacheado e se ocorreu erro na busca
        const cachedUniform = this.uniformBlockCache.get(name);
        if (cachedUniform) {
            if (cachedUniform.error) {
                console.debug(`Busca para o uniforme '${name}' está bloqueada devido a falhas anteriores.`);
                return null;
            }
            return cachedUniform.location;
        }
    
        // Tenta buscar a localização do bloco de uniforme no programa de shader
        const location = gl.getUniformBlockIndex(this.program, name);
    
        // Caso não consiga encontrar, registra a falha e bloqueia futuras tentativas
        if (location === -1) {
            console.error(`Falha ao encontrar o bloco de uniforme '${name}' no shader.`);
            // Armazena no cache com erro
            this.uniformBlockCache.set(name, { location: null, error: true });
            return null;
        }
    
        // Cacheia a localização encontrada para otimizar buscas futuras
        this.uniformBlockCache.set(name, { location, error: false });
        return location;
    }

    public dispose(): void {
        const gl = Display.webGl;
        if (this.program) {
            gl.deleteProgram(this.program);
            this.program = null;
        }
    }

    public enableAttribute3f(gl: WebGLRenderingContext, name: string) {
        const location = this.getAttributeLocation(name);
        if (location !== null) {
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, 3, gl.FLOAT, false, 0, 0);
        }
    }
   
    public enableAttribute16f(gl: WebGLRenderingContext, name: string) {
        const location = this.getAttributeLocation(name);
        if (location !== null) {
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, 16, gl.FLOAT, false, 0, 0);
        }
    }

    public enableAttribute2f(gl: WebGLRenderingContext, name: string) {
        const location = this.getAttributeLocation(name);
        if (location !== null) {
            gl.enableVertexAttribArray(location);
            gl.vertexAttribPointer(location, 2, gl.FLOAT, false, 0, 0);
        }
    }

    public disableAttribute(gl: WebGLRenderingContext, name: string) {
        const location = this.getAttributeLocation(name);
        if(location !== null) {
            gl.disableVertexAttribArray(location);
        }
    }
}