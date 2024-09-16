// import Mesh from "./Mesh";
// import Camera from "../Core/Inplementations/Camera";
// import Transform from "../Core/Inplementations/Transform";
// import Material from "../Core/Inplementations/Material";
// import Renderer from "./Renderer";


// export default class MeshRenderer extends Renderer {
//     public mesh: Mesh | null = null;
//     public material: Material | null;
//     public renderMode: RenderMode = RenderMode.SOLID;
    
//     public setMesh(mesh: Mesh): void {
//         this.mesh = mesh;
//     }   

    
//     public render(gl: WebGL2RenderingContext, transform: Transform): void {
//         this.renderScene(gl, transform);
//     }
//     private renderScene(gl: WebGL2RenderingContext, transform: Transform) {
//         const camera = Camera.currentCamera;

//         if (!camera || !this.mesh || !this.material || !this.mesh.triangles) return;
    
//         // Configure o shader da cena
//         this.material.shader.use();
      
//         // Defina as propriedades e as matrizes no shader
//         const projection = camera.getProjectionMatrix();
//         const view = camera.getViewMatrix();
//         const model = transform.getModelMatrix();
    
//         this.material.shader.setUniformMatrix4fv("uModel", model);
//         this.material.shader.setUniformMatrix4fv("uView", view);
//         this.material.shader.setUniformMatrix4fv("uProjection", projection);
    
//         // Configure os buffers e atributos
//         gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.vertexBuffer);
//         this.material.shader.enableAttribute3f(gl, "aPosition");
    
//         gl.bindBuffer(gl.ARRAY_BUFFER, this.mesh.UVBuffer);
//         this.material.shader.enableAttribute2f(gl, "aTexCoord");
   
//         if (this.material.albedo) {
//             gl.activeTexture(gl.TEXTURE0);
//             gl.bindTexture(gl.TEXTURE_2D, this.material.albedo);
//             this.material.shader.setUniform1i("uAlbedo", 0);
//             this.material.shader.setUniform1i("uHasAlbedo", 1); 
//         } else {
//             this.material.shader.setUniform1i("uHasAlbedo", 0); 
//         }
    
//         if (this.material.normalMap) {
//             gl.activeTexture(gl.TEXTURE1);
//             gl.bindTexture(gl.TEXTURE_2D, this.material.normalMap);
//             this.material.shader.setUniform1i("uNormalMap", 1);
//         }
    
//         // Desenhe a cena

//         const [x, y, z, w] = this.material.color.toVec4();
//         this.material.shader.setUniform4f("uColor", x, y, z, w);

//         gl.enable(gl.BLEND);
//         gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

//         gl.enable(gl.DEPTH_TEST);
//         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.mesh.indexBuffer);
        
//         gl.drawElements(gl.TRIANGLES, this.mesh.triangles.length, gl.UNSIGNED_SHORT, 0);
    
//         // Limpeza
//         this.material.shader.disableAttribute(gl, "aPosition");
//         this.material.shader.disableAttribute(gl, "aTexCoord");
    
//         gl.bindBuffer(gl.ARRAY_BUFFER, null);
//         gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    
//         gl.activeTexture(gl.TEXTURE0);
//         gl.bindTexture(gl.TEXTURE_2D, null);
//         gl.activeTexture(gl.TEXTURE1);
//         gl.bindTexture(gl.TEXTURE_2D, null);
//     }
// }

// /**
//  * Enum para representar os modos de renderização.
//  */
// export enum RenderMode {
//     TEXTURED = "TEXTURED",
//     SOLID = "SOLID",
//     WIREFRAME = "WIREFRAME",
//     SHADED = "SHADED",
//     ADVANCED = "ADVANCED",
//     SOLID_WIRE = "SOLIDWIRE"
// }


// // class ShadowMap {
// //     public texture: WebGLTexture | null = null;
// //     private framebuffer: WebGLFramebuffer | null = null;
// //     public material: Material = new Material();

// //     constructor(private gl: WebGLRenderingContext, width: number, height: number) {
// //         this.texture = gl.createTexture();
// //         gl.bindTexture(gl.TEXTURE_2D, this.texture);
// //         gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT16, width, height, 0, gl.DEPTH_COMPONENT, gl.UNSIGNED_SHORT, null);
// //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
// //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
// //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
// //         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

// //         this.framebuffer = gl.createFramebuffer();
// //         gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
// //         gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.texture, 0);
// //         gl.bindFramebuffer(gl.FRAMEBUFFER, null);

// //         this.setupShadowShader(this.material.shader);
// //     }

// //     public bind(): void {
// //         gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
// //     }

// //     public unbind(): void {
// //         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
// //     }

// //     public setupShadowShader(shader: Shader): void {
// //         shader.setVertSource(`
// //             attribute vec4 aPosition;
// //             uniform mat4 uLightMVP;
// //             void main() {
// //                 gl_Position = uLightMVP * aPosition;
// //             }
// //         `);
    
// //         shader.setFragSource(`
// //             // Fragment Shader para o ShadowMap
// //             void main() {
// //                 // Defina uma cor fixa (não usamos gl_FragDepth em WebGL 1.0)
// //                 gl_FragColor = vec4(0.0);
// //             }
// //         `);
    
// //         shader.compile();
// //     }
// // }
