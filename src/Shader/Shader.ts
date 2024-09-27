import Matrix4x4 from "../../engine_modules/matrices/Matrix4x4";
import Vector2 from "../../engine_modules/vectors/Vector2";
import Vector3 from "../../engine_modules/vectors/Vector3";
import ShaderUtil from "./Shader.Util";
import { IRenderingApi } from "../global";
import ServiceLocator from "../Engine/graphycs/ServiceLocator";

export class Shader {

    private vertSource: string;
    private fragSource: string;
    private API: IRenderingApi;
    private gl: WebGL2RenderingContext;
    public name: string = "";

    constructor(vertSource: string = "", fragSource: string = ""){
        this.vertSource = vertSource;
        this.fragSource = fragSource;
        this.API = ServiceLocator.get<IRenderingApi>("RenderingApi");
        this.gl = this.API.getRenderInstance() as WebGL2RenderingContext;
        this.compile();
    }

    public program: WebGLProgram | null = null;

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
        if (this.program) {
            this.gl.useProgram(this.program);
        }
    }

    public deactivate(): void {
        this.gl.useProgram(null);
    }

    public setUniform2f(name: string, x: number, y: number) {
        const location = this.getUniformLocation(name);
        if (location) {
            this.gl.uniform2f(location, x, y);
        }
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

    public setSample2d(name: string, texture: WebGLTexture, textureUnit: number = 0) {
        const location = this.getUniformLocation(name);
        if (location === null) {
            console.error(`Uniform location for ${name} not found.`);
            return;
        }

        this.gl.activeTexture(this.gl.TEXTURE0 + textureUnit);
        this.gl.bindTexture(this.gl.TEXTURE_2D, texture);
        this.gl.uniform1i(location, textureUnit);
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

    public static async loadShaderAsync(shaderGLSL: string): Promise<string> {
        if (!shaderGLSL.trim()) {
            throw new Error("Shader source URL is empty or whitespace.");
        }
    
        try {
            const response = await fetch(shaderGLSL);
            if (!response.ok) {
                throw new Error(`Failed to load shader file: ${response.statusText}`);
            }
            const shaderSource = await response.text();
           
            return shaderSource;
        } catch (error) {
            console.error('Error loading shader:', error);
            throw error;
        }
    }
    

    public static async createShaderAsync(vertSource: string, fragSource: string): Promise<Shader> {
        
        try {
        
            const vert = await Shader.loadShaderAsync(vertSource);
            const frag = await Shader.loadShaderAsync(fragSource);
    
            return new Shader(vert, frag);
        } catch (error) {
            console.error('Error creating shader:', error);
            throw error; 
        }
    }
    
}

export enum AttributesLocation {
    VertexPosition = "a_position",
    VERTEX_POSITION = "VERTEX_POSITION",
    VERTEX_NORMAL = "VERTEX_NORMAL",

}

export enum UniformsLocation {
    ObjectModelMatrix = "u_modelMatrix",
    ObjectColor = "u_color",
    CameraProjectionMatrix = "u_projectionMatrix",
    CameraViewMatrix = "u_viewMatrix",

    OBJECT_COLOR = "OBJECT_COLOR",
    MODEL_MATRIX = "MODEL_MATRIX",
    PROJECTION_MATRIX = "PROJECTION_MATRIX",
    VIEW_MATRIX = "VIEW_MATRIX",
    CAMERA_POSITION = "CAMERA_POSITION",
    LIGHT_POSITION = "LIGHT_POSITION",
    WORLD_NORMAL_MATRIX = "WORLD_NORMAL_MATRIX",
    CAMERA_DIRECTION = "CAMERA_DIRECTION",

    DIFFUSE = "DIFFUSE",
    MATERIAL_SPECULAR = "MATERIAL_SPECULAR",
    METALIC = "METALIC",
    SMOOTHNESS = "SMOOTHNESS",
}