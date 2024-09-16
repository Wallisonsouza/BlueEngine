import Matrix4x4 from "../../engine_modules/matrices/Matrix4x4";
import Vector2 from "../../engine_modules/vectors/Vector2";
import EngineCache from "../Engine/static/EngineCache";
import Vector3 from "../../engine_modules/vectors/Vector3";
import ShaderUtil from "./Shader.Util";
import { IRenderingApi } from "../global";

export class Shader {

    private vertSource: string;
    private fragSource: string;
    private API: IRenderingApi;
    private gl: WebGL2RenderingContext;

    constructor(vertSource: string = "", fragSource: string = ""){
        this.vertSource = vertSource;
        this.fragSource = fragSource;
        this.API = EngineCache.getRenderingAPI();
        this.gl = this.API.getRenderInstance() as WebGL2RenderingContext;
        this.compile();
    }

    private program: WebGLProgram | null = null;
    private static currentProgram: WebGLProgram | null = null;

    private attributeCache: Map<string, number> = new Map();
    private uniformCache: Map<string, WebGLUniformLocation> = new Map();
   
    public setFragSource(source: string): void {
        this.fragSource = source;
    }
   
    public setVertSource(source: string): void {
        this.vertSource = source;
    }
 
    public compile(): void {
        this.program = ShaderUtil.createProgram(this.gl, this.vertSource, this.fragSource);
        if (!this.program) {
            throw new Error("Falha ao criar o programa de shaders.");
        }

        this.use();
        console.log("Shader compilado e programa criado com sucesso.");
    }

    public use(): void {
        if (Shader.currentProgram !== this.program) {
            this.gl.useProgram(this.program);
            Shader.currentProgram = this.program;
        }
    }

    public deactivate(): void {
        if (Shader.currentProgram === this.program) {
            this.gl.useProgram(null);
            Shader.currentProgram = null;
        }
    }

    public setUniform2f(name: string, x: number, y: number): string {
        const location = this.getUniformLocation(name);
        if (location) {
            this.gl.uniform2f(location, x, y);
        }

        return `uniform vec2 ${name};`
    }
    public setUniform3f(name: string, x: number, y: number, z: number) {
        const location = this.getUniformLocation(name);
        if (location) {
            this.gl.uniform3f(location, x, y, z);
        }
    }
    public setUniform3fv(name: string, values: Float32Array | number[] | Vector3) {
        const location = this.getUniformLocation(name);
    
        if (location) {
          
            if (!(values instanceof Float32Array)) {
                if (Array.isArray(values)) {
                    values = new Float32Array(values);
                } else if (values instanceof Vector3) {
                    values = new Float32Array([values.x, values.y, values.z]);
                }
            }
            
            this.gl.uniform3fv(location, values);
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
            
            this.gl.uniform2fv(location, values);
        } 
    }

    public setUniform1i(name: string, value: number){
        const location = this.getUniformLocation(name);
        if(location){
            this.gl.uniform1i(location, value);
        }
    }
    public setUniform1f(name: string, value: number){
        const location = this.getUniformLocation(name);
        if(location){
            this.gl.uniform1f(location, value);
        }
    }

    public setUniformMatrix4fv(name: string, matrix: Float32Array | Matrix4x4, transpose: boolean = false): void {
        const location = this.getUniformLocation(name);
        if (location) {

            if (!(matrix instanceof Float32Array)) {
                matrix = matrix.getData();
            }
            this.gl.uniformMatrix4fv(location, transpose, matrix);
        }
    }
    
    public setUniform4f(name: string, x: number, y: number, z: number, w: number) {
        const location = this.getUniformLocation(name);
        if (location) {
            this.gl.uniform4f(location, x, y, z, w);
        }
    }

    public setUniform4fv(name: string, value: number[]) {
        const location = this.getUniformLocation(name);
        if (location) {
            this.gl.uniform4fv(location, value);
        }
    }

    private withGlAndProgram<T>(callback: (gl: WebGLRenderingContext, program: WebGLProgram) => T | null): T | null {
        if (!this.gl) {
            console.error("WebGL context não disponível.");
            return null;
        }

        if (!this.program) {
            console.error("Programa do shader não disponível.");
            return null;
        }

        return callback(this.gl, this.program);
    }

    public getAttributeLocation(name: string): number | null {
        return this.withGlAndProgram((gl, program) => {
            if (this.attributeCache.has(name)) {
                return this.attributeCache.get(name)!;
            }

            const location = gl.getAttribLocation(program, name);
            if (location === -1) {
                console.error(`Não foi possível encontrar o atributo '${name}' no shader.`);
                return null;
            }

            this.attributeCache.set(name, location);
            return location;
        });
    }

    public getUniformLocation(name: string): WebGLUniformLocation | null {

        const gl = this.gl;
        const program = this.program;

        if(!program) return null;

        if (this.uniformCache.has(name)) {
            return this.uniformCache.get(name)!;
        }

        const location = gl.getUniformLocation(program, name);
        if (!location) {
            console.error(`Não foi possível encontrar o uniforme '${name}' no shader.`);
            return null;
        }

        this.uniformCache.set(name, location);
        return location;
    }

    public dispose(): void {
        if (this.program) {
            this.gl.deleteProgram(this.program);
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

    public static async loadShaderAsync(shaderGLSL: string) {
        const shaderSource = await fetch(shaderGLSL)
        .then(response => response.text());
        return shaderSource;
    }

    public static async createShaderAsync(vertSource: string, fragSource: string) {
        const vert = await fetch(vertSource)
        .then(response => response.text());

        const frag = await fetch(fragSource)
        .then(response => response.text());

        return new Shader(vert, frag);
    }
}
