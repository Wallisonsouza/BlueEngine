import { IRenderingApi } from "../../global";
import Matrix4x4 from "../math/Matrix4x4";
import { Shader } from "../graphics/shaders/Shader";
import Camera from "../components/Camera";
import { BufferManager } from "../managers/BufferManager";
import Mesh from "../graphics/mesh/Mesh";
import { WebGL2Api } from "../graphics/mesh/WebGl2Api";
import Color from "../math/color";
import Quaternion from "../math/Quaternion";
import Vector3 from "../math/Vector3";
import ServiceLocator from "./ServiceLocator";

export default class Gizmos {

    public static drawTriangle(v0: Vector3, v1: Vector3, v2: Vector3) {
        Gizmos.drawLine(v0, v1);
        Gizmos.drawLine(v1, v2);
        Gizmos.drawLine(v2, v0);
    }
    

    public static color: Color = Color.white;
    
    private static getApiAndCamera(): [IRenderingApi] {

        const api = ServiceLocator.get<IRenderingApi>('RenderingApi');
        return [api];

    }

    public static drawLine(start: Vector3, end: Vector3) {
        const [api,] = this.getApiAndCamera();
    
        if(api instanceof WebGL2Api) {
            DrawWebGL2.drawLine(api.context, start, end);
        } else {
            console.error("API não reconhecida");
        }
    }

    public static drawWireCube(position: Vector3 = Vector3.zero, size: Vector3 = Vector3.one, rotation: Quaternion = Quaternion.identity) {
        const [api,] = this.getApiAndCamera();
    
        if(api instanceof WebGL2Api) {
            DrawWebGL2.drawCube(api.context, position, size, rotation);
        } else {
            console.error("API não reconhecida");
        }
     
    }

    public static drawWireSphere(position: Vector3 = Vector3.zero, size: number, rotation: Quaternion = Quaternion.identity) {
        const [api,] = this.getApiAndCamera();
    
        if(api instanceof WebGL2Api) {
            DrawWebGL2.drawSphere(api.context, position, size, rotation);
        } else {
            console.error("API não reconhecida");
        }
    }
}

export class DrawWebGL2 {
    private static vertexBuffer: WebGLBuffer | null = null;
    private static indexBuffer: WebGLBuffer | null = null;
    private static lineVertices: Float32Array = new Float32Array(6);
    private static lineIndices = new Uint16Array([0, 1]);

    private static initializeBuffers(gl2: WebGL2RenderingContext): void {
        if (!this.vertexBuffer) {
            this.vertexBuffer = gl2.createBuffer();
            gl2.bindBuffer(gl2.ARRAY_BUFFER, this.vertexBuffer);
            gl2.bufferData(gl2.ARRAY_BUFFER, this.lineVertices, gl2.DYNAMIC_DRAW);
        }
        if (!this.indexBuffer) {
            this.indexBuffer = gl2.createBuffer();
            gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
            gl2.bufferData(gl2.ELEMENT_ARRAY_BUFFER, this.lineIndices, gl2.STATIC_DRAW);
        }
    }

    public static drawLine(gl2: WebGL2RenderingContext, start: Vector3, end: Vector3): void {
        
        const shader = Shader.getShader("Line");
        const camera = Camera.mainCamera; 
        if(!shader) {return}
        if(!camera) {return}
       

        this.lineVertices.set([
            start.x, start.y, start.z,
            end.x, end.y, end.z
        ]);

        gl2.bindBuffer(gl2.ARRAY_BUFFER, this.vertexBuffer);
        gl2.bufferSubData(gl2.ARRAY_BUFFER, 0, this.lineVertices);

        this.initializeBuffers(gl2);
        
        shader.use();
        shader.enableAttribute3f(gl2, "a_position");
        shader.setUniformMatrix4fv("u_modelMatrix", Matrix4x4.identity());
        shader.setUniformMatrix4fv("u_viewMatrix", camera.viewMatrix);
        shader.setUniformMatrix4fv("u_projectionMatrix", camera.projectionMatrix);
        shader.setUniform4fv("u_color", Gizmos.color.rgba);
       

        gl2.bindBuffer(gl2.ARRAY_BUFFER, this.vertexBuffer);
        gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl2.disable(gl2.DEPTH_TEST);
        gl2.drawElements(gl2.LINES, 2, gl2.UNSIGNED_SHORT, 0);
    }

    public static drawCube(gl2: WebGL2RenderingContext, position: Vector3, size: Vector3, rotation: Quaternion) {
       
        const mesh = ServiceLocator.get<Mesh>("CubeMesh");
        const shader = Shader.getShader("Gizmos");
        const camera = Camera.mainCamera; 
        const buffer = BufferManager.getBuffer(mesh.id);

        if(!camera) return;
        if(!shader) return;
        if(!buffer) return;
        if(!mesh.triangles) return;
        gl2.bindBuffer(gl2.ARRAY_BUFFER, buffer.vertexBuffer);
        
        shader.use();
        shader.enableAttribute3f(gl2, "a_position");
        shader.setUniformMatrix4fv("u_modelMatrix", Matrix4x4.createModelMatrix(position, rotation, size));
        shader.setUniformMatrix4fv("u_viewMatrix", camera.viewMatrix);
        shader.setUniformMatrix4fv("u_projectionMatrix", camera.projectionMatrix);
        shader.setUniform4fv("u_color", Gizmos.color.rgba);

  
        gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, buffer.indexBuffer);

        gl2.disable(gl2.DEPTH_TEST);
        gl2.drawElements(gl2.LINE_STRIP, mesh.triangles.length, gl2.UNSIGNED_SHORT, 0);

    }

    public static drawSphere(gl2: WebGL2RenderingContext, position: Vector3, size: number, rotation: Quaternion) {
       
        const mesh = ServiceLocator.get<Mesh>("SphereMesh");
        const shader = Shader.getShader("Gizmos");
        const camera = Camera.mainCamera; 
        const buffer = BufferManager.getBuffer(mesh.id);

        if(!camera) return;
        if(!shader) return;
        if(!buffer) return;
        if(!mesh.triangles) return;

        gl2.bindBuffer(gl2.ARRAY_BUFFER, buffer.vertexBuffer);
        
        shader.use();
        shader.enableAttribute3f(gl2, "a_position");
        shader.setUniformMatrix4fv("u_modelMatrix", Matrix4x4.createModelMatrix(position, rotation, Vector3.fromNumber(size)));
        shader.setUniformMatrix4fv("u_viewMatrix", camera.viewMatrix);
        shader.setUniformMatrix4fv("u_projectionMatrix", camera.projectionMatrix);
        shader.setUniform4fv("u_color", Gizmos.color.rgba);

  
        gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, buffer.indexBuffer);

        gl2.disable(gl2.DEPTH_TEST);
        gl2.drawElements(gl2.LINE_STRIP, mesh.triangles.length, gl2.UNSIGNED_SHORT, 0);

    }
}