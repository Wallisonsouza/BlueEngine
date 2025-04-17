// import Square from "./core/Builders/Square";
// import { BufferManager } from "./core/managers/BufferManager";
// import ShaderManager from "./core/managers/ShaderManager";

// export default class LUT {
//     private gl: WebGL2RenderingContext;
//     public brdfLUTTexture: WebGLTexture | null = null;

//     constructor(gl: WebGL2RenderingContext) {
//         this.gl = gl;

//         // Verifica se a extensão EXT_color_buffer_float está disponível
//         const ext = gl.getExtension("EXT_color_buffer_float");
//         if (!ext) {
//             throw new Error("EXT_color_buffer_float não suportado no WebGL2.");
//         }
//     }

//     private createBRDFLUTTexture(): WebGLTexture {
//         const gl = this.gl;
//         const brdfLUTTexture = gl.createTexture();
//         gl.bindTexture(gl.TEXTURE_2D, brdfLUTTexture);

//         // Alocar memória para a textura
//         gl.texImage2D(gl.TEXTURE_2D, 0, gl.RG16F, 1024, 1024, 0, gl.RG, gl.FLOAT, null);

//         // Definir os parâmetros da textura (borda e filtros)
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
//         gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

//         return brdfLUTTexture;
//     }

//     private createFramebufferForLUT(brdfLUT: WebGLTexture): WebGLFramebuffer {
//         const gl = this.gl;
//         // Criar o framebuffer
//         const captureFBO = gl.createFramebuffer();
//         gl.bindFramebuffer(gl.FRAMEBUFFER, captureFBO);

//         // Criar o renderbuffer para profundidade
//         const captureRBO = gl.createRenderbuffer();
//         gl.bindRenderbuffer(gl.RENDERBUFFER, captureRBO);
//         gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, 1024, 1024);

//         // Anexar a textura LUT ao framebuffer
//         gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, brdfLUT, 0);

//         return captureFBO;
//     }

//     private renderQuad() {
//         const gl = this.gl;
//         const squareMesh = Square.getMesh();
//         const vbo = BufferManager.getMeshBuffer(squareMesh.id.value);

//         gl.bindVertexArray(vbo);
//         gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
//         gl.bindVertexArray(null);
//     }

//     public generateBRDFLUT(roughness: number) {
//         const gl = this.gl;
//         this.brdfLUTTexture = this.createBRDFLUTTexture();
//         const captureFBO = this.createFramebufferForLUT(this.brdfLUTTexture);
//         const captureRBO = gl.createRenderbuffer();
    
//         gl.bindFramebuffer(gl.FRAMEBUFFER, captureFBO);
//         gl.bindRenderbuffer(gl.RENDERBUFFER, captureRBO);
    
//         // Definir a área de renderização
//         gl.viewport(0, 0, 1024, 1024);
//         gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
//         const shader = ShaderManager.getShader("lut");
//         shader?.use();
//         shader?.setFloat("roughness", roughness); // Caso seja um número simples, passe ele como o valor de roughness
    
//         // Renderiza um quadrado para gerar a LUT
//         this.renderQuad();
    
//         // Desvincular o framebuffer
//         gl.bindFramebuffer(gl.FRAMEBUFFER, null);
//     }
// }