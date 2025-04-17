// import Matrix4x4 from "../math/Matrix4x4";
// import Camera from "../components/Camera";
// import { BufferManager } from "../managers/BufferManager";
// import Color from "../math/color";
// import Quaternion from "../math/Quaternion";
// import Vector3 from "../math/Vector3";
// import ShaderManager from "../managers/ShaderManager";
// import MeshManager from "../managers/MeshManager";
// import Engine from "../engine";
// import { RenderMode } from "../enum/RenderMode";


// export default class Gizmos {

//     public static color: Color = Color.WHITE;

//     public static drawTriangle(v0: Vector3, v1: Vector3, v2: Vector3) {
//         Gizmos.drawLine(v0, v1);
//         Gizmos.drawLine(v1, v2);
//         Gizmos.drawLine(v2, v0);
//     }

//     public static drawLine(start: Vector3, end: Vector3) {
//         const context = Engine.gl;
//         if(context instanceof WebGL2RenderingContext) {
//             DrawWebGL2.drawLine(context, start, end);
//         } else {
//             console.error("API não reconhecida");
//         }
//     }

//     public static drawCube(position: Vector3 = Vector3.zero, scale: Vector3 = Vector3.one, rotation: Quaternion = Quaternion.IDENTITY, mode: RenderMode = RenderMode.TRIANGLES) {
        
//         const context = Engine.gl;
//         if(context instanceof WebGL2RenderingContext) {
//             DrawWebGL2.drawCube(context, position, scale, rotation, mode);
//         } else {
//             console.error("API não reconhecida");
//         }
//     }

//     public static drawSphere(position: Vector3 = Vector3.zero, size: number = 1.0, rotation: Quaternion = Quaternion.IDENTITY, mode: RenderMode = RenderMode.TRIANGLES) {
//         const api = Engine.gl;
    
//         if(api instanceof WebGL2RenderingContext) {
//             DrawWebGL2.drawSphere(api, position, size, rotation, mode);
//         } else {
//             console.error("API não reconhecida");
//         }
//     }
// }

// export class DrawWebGL2 {
//     private static vertexBuffer: WebGLBuffer | null = null;
//     private static indexBuffer: WebGLBuffer | null = null;
//     private static lineVertices: Float32Array = new Float32Array(6);
//     private static lineIndices = new Uint16Array([0, 1]);

//     private static initializeBuffers(gl2: WebGL2RenderingContext): void {
//         if (!this.vertexBuffer) {
//             this.vertexBuffer = gl2.createBuffer();
//             gl2.bindBuffer(gl2.ARRAY_BUFFER, this.vertexBuffer);
//             gl2.bufferData(gl2.ARRAY_BUFFER, this.lineVertices, gl2.DYNAMIC_DRAW);
//         }
//         if (!this.indexBuffer) {
//             this.indexBuffer = gl2.createBuffer();
//             gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
//             gl2.bufferData(gl2.ELEMENT_ARRAY_BUFFER, this.lineIndices, gl2.STATIC_DRAW);
//         }
//     }

//     public static drawLine(gl2: WebGL2RenderingContext, start: Vector3, end: Vector3): void {
//         const shader = ShaderManager.getShader("Line");
//         const camera = Camera.main; 
//         if(!shader) {return}
//         if(!camera) {return}
    
//         this.initializeBuffers(gl2);
//         this.lineVertices.set([
//             start.x, start.y, start.z,
//             end.x, end.y, end.z
//         ]);
    
//         gl2.bindBuffer(gl2.ARRAY_BUFFER, this.vertexBuffer);
//         gl2.bufferSubData(gl2.ARRAY_BUFFER, 0, this.lineVertices);
        
//         shader.use();
//         shader.enableAttribute3f(gl2, "a_position");
//         shader.setMat4("u_modelMatrix", Matrix4x4.identity);
//         shader.setMat4("u_viewMatrix", camera.viewMatrix);
//         shader.setMat4("u_projectionMatrix", camera.projectionMatrix);
//         shader.setVec4("u_color", Gizmos.color.rgba);
    
//         gl2.bindBuffer(gl2.ARRAY_BUFFER, this.vertexBuffer);
//         gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    
//         gl2.disable(gl2.DEPTH_TEST);
//         gl2.drawElements(gl2.LINES, this.lineIndices.length, gl2.UNSIGNED_SHORT, 0);
//         gl2.bindBuffer(gl2.ARRAY_BUFFER, null);
//         gl2.bindBuffer(gl2.ELEMENT_ARRAY_BUFFER, null);
//     }

//     public static drawCube(gl2: WebGL2RenderingContext, position: Vector3, scale: Vector3, rotation: Quaternion, renderMode: RenderMode = RenderMode.LINE_STRIP) {
//         const mesh = MeshManager.getByName("cube");
//         if (!mesh?.triangles) return;
    
//         const buffer = BufferManager.getMeshBuffer(mesh.id);
//         if (!buffer) return;
    
//         const shader = ShaderManager.getShader("Gizmos");
//         if (!shader) return;
    
//         const camera = Camera.main;
//         if (!camera) return;
    
//         gl2.bindVertexArray(buffer);
    
//         shader.use();
//         shader.setMat4("u_modelMatrix", Matrix4x4.createModelMatrix(position, rotation, scale));
//         shader.setMat4("u_viewMatrix", camera.viewMatrix);
//         shader.setMat4("u_projectionMatrix", camera.projectionMatrix);
//         shader.setVec4("u_color", Gizmos.color.rgba);

    
//         gl2.enable(gl2.DEPTH_TEST);
//         gl2.drawElements(renderMode, mesh.triangles.length, gl2.UNSIGNED_SHORT, 0);
        
    
//     }

//     public static drawSphere(gl2: WebGL2RenderingContext, position: Vector3, size: number, rotation: Quaternion, renderMode: RenderMode = RenderMode.TRIANGLE_STRIP) {
       
//         const mesh = MeshManager.getByName("sphere");
   
//         if(!mesh?.triangles) return;
//         const buffer = BufferManager.getMeshBuffer(mesh.id);
//         if(!buffer) return;
     
//         const shader = ShaderManager.getShader("Gizmos");
//         if(!shader) return;
     
//         const camera = Camera.main; 
//         if(!camera) return;
      
//         gl2.bindVertexArray(buffer);
        
//         shader.use();
//         shader.setMat4("u_modelMatrix", Matrix4x4.createModelMatrix(position, rotation, new Vector3(size, size, size)));
//         shader.setMat4("u_viewMatrix", camera.viewMatrix);
//         shader.setMat4("u_projectionMatrix", camera.projectionMatrix);
//         shader.setVec4("u_color", Gizmos.color.rgba);
        
//         gl2.disable(gl2.DEPTH_TEST);
//         gl2.drawElements(renderMode, mesh.triangles.length, gl2.UNSIGNED_SHORT, 0);
//         gl2.enable(gl2.DEPTH_TEST);

//     }
// }