// import Engine from "../engine";
// import Color from "../math/color";

// export default class TextureBuilder {

//     static createCubemapTexture(
//         gl: WebGL2RenderingContext,
//         back: HTMLImageElement,
//         front: HTMLImageElement,
//         left: HTMLImageElement,
//         right: HTMLImageElement,
//         top: HTMLImageElement,
//         bottom: HTMLImageElement
//     ): WebGLTexture | null {
//         const texture = gl.createTexture();
//         if (!texture) {
//             console.error("Unable to create WebGL texture.");
//             return null;
//         }
    
//         // Bind the texture to the cube map target
//         gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);
    
//         // Define the six faces of the cube map
//         const faces = [
//             { target: gl.TEXTURE_CUBE_MAP_POSITIVE_X, image: right },
//             { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_X, image: left },
//             { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Y, image: top },
//             { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Y, image: bottom },
//             { target: gl.TEXTURE_CUBE_MAP_POSITIVE_Z, image: front },
//             { target: gl.TEXTURE_CUBE_MAP_NEGATIVE_Z, image: back },
//         ];
    
//         // Load each image into the corresponding face of the cube map
//         faces.forEach((face) => {
//             const { target, image } = face;
//             gl.texImage2D(target, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
//         });
    
//         // Set texture parameters
//         gl.generateMipmap(gl.TEXTURE_CUBE_MAP);
//         gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
//         gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//         gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//         gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//         gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
//         // Unbind the texture
//         gl.bindTexture(gl.TEXTURE_CUBE_MAP, null);
    
//         return texture;
//     }

//     static createEmptyCubeMapTexture(
//         size: number, 
//         mipLevels: number = 5,
//         leftColor: Color = Color.BLACK,
//         rightColor: Color = Color.BLACK,
//         topColor: Color = Color.BLACK,
//         bottomColor: Color = Color.BLACK,
//         frontColor: Color = Color.BLACK,
//         backColor: Color = Color.BLACK,
//     ) {

//         const gl = Engine.gl; 
//         const faceColors = [
//             leftColor,   // POSITIVE_X
//             rightColor,  // NEGATIVE_X
//             topColor,    // POSITIVE_Y
//             bottomColor, // NEGATIVE_Y
//             frontColor,  // POSITIVE_Z
//             backColor    // NEGATIVE_Z
//         ];

//         // Criar a textura cubo
//         const texture = gl.createTexture();
//         gl.bindTexture(gl.TEXTURE_CUBE_MAP, texture);

//         // Para cada nível de mipmap, preenche a face com a cor correspondente
//         for (let i = 0; i < mipLevels; i++) {
//             const mipSize = size >> i;
            
//             // Para cada face do cubo
//             for (let face = 0; face < 6; face++) {
//                 // Criar o array de cores para a face
//                 let colorArray = new Float32Array(mipSize * mipSize * 4);
//                 let color = faceColors[face];

//                 // Preencher o array com a cor da face
//                 for (let j = 0; j < mipSize * mipSize; j++) {
//                     colorArray[j * 4] = color.r;   // Red
//                     colorArray[j * 4 + 1] = color.g; // Green
//                     colorArray[j * 4 + 2] = color.b; // Blue
//                     colorArray[j * 4 + 3] = color.a; // Alpha
//                 }

//                 // Definir a textura para a face com a cor preenchida
//                 gl.texImage2D(
//                     gl.TEXTURE_CUBE_MAP_POSITIVE_X + face,
//                     i,
//                     gl.RGBA16F,
//                     mipSize,
//                     mipSize,
//                     0,
//                     gl.RGBA,
//                     gl.FLOAT,
//                     colorArray
//                 );
//             }
//         }

//         // Configurações de parâmetros para a textura cubo
//         gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
//         gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
//         gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
//         gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
//         gl.texParameteri(gl.TEXTURE_CUBE_MAP, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);

//         // Gerar mipmaps para a textura
//         gl.generateMipmap(gl.TEXTURE_CUBE_MAP);

//         // Retornar a textura criada
//         return texture;
//     }
// }
    
    
    
    
//     // static async createFilterMapTexture( gl2: WebGL2RenderingContext, cubeMapTextures: {
//     //     back: Texture;
//     //     front: Texture;
//     //     left: Texture;
//     //     right: Texture;
//     //     top: Texture;
//     //     bottom: Texture;
//     // }) {
    
//     //     const cubeMesh = MeshManager.getByName("cube");
//     //     function renderCube() {

//     //         if(cubeMesh) {
//     //             const buffer = BufferManager.getMeshBuffer(cubeMesh.id);
//     //             if(buffer) {
//     //                 gl2.bindVertexArray(buffer);
//     //                 gl2.drawElements(gl2.TRIANGLES, cubeMesh.triangles.length, gl2.UNSIGNED_SHORT, 0);
//     //             }
//     //         }
            
        
        
//     //     }

//     //     const prefilterShader = ShaderManager.getShader("preFilter");

//     //     if (prefilterShader) {
//     //         prefilterShader.bind();

//     //         const texture = await LoadResources.loadTexture("assets/ninomaru_teien.webp");
//     //         if(!texture.webGLTexture) {throw new Error("Falha na textura")};

//     //         prefilterShader.setSample2d("envTexture", texture.webGLTexture);

//     //         const width = 512;
//     //         const height = 512;
        
//     //         const prefilterMap = this.createCubemapTexture(cubeMapTextures);

//     //         // Criação do framebuffer e renderbuffer
//     //         const captureFBO = gl2.createFramebuffer();
//     //         const captureRBO = gl2.createRenderbuffer();

//     //         const captureViews = [
//     //             Matrix4x4.lookAt(new Vector3(0, 0, 0), new Vector3(1, 0, 0), new Vector3(0, 1, 0)), // Positivo X
//     //             Matrix4x4.lookAt(new Vector3(0, 0, 0), new Vector3(-1, 0, 0), new Vector3(0, 1, 0)), // Negativo X
//     //             Matrix4x4.lookAt(new Vector3(0, 0, 0), new Vector3(0, 1, 0), new Vector3(0, 0, 1)), // Positivo Y
//     //             Matrix4x4.lookAt(new Vector3(0, 0, 0), new Vector3(0, -1, 0), new Vector3(0, 0, 1)), // Negativo Y
//     //             Matrix4x4.lookAt(new Vector3(0, 0, 0), new Vector3(0, 0, 1), new Vector3(0, 1, 0)), // Positivo Z
//     //             Matrix4x4.lookAt(new Vector3(0, 0, 0), new Vector3(0, 0, -1), new Vector3(0, 1, 0))  // Negativo Z
//     //         ];

//     //         gl2.bindFramebuffer(gl2.FRAMEBUFFER, captureFBO);

//     //         const maxMipLevels = 5;
//     //         for (let mip = 0; mip < maxMipLevels; mip++) {
//     //             const mipWidth = width * Math.pow(0.5, mip);
//     //             const mipHeight = height * Math.pow(0.5, mip);

//     //             // Ajuste o framebuffer de acordo com o nível de mipmap
//     //             gl2.bindRenderbuffer(gl2.RENDERBUFFER, captureRBO);
//     //             gl2.renderbufferStorage(gl2.RENDERBUFFER, gl2.DEPTH_COMPONENT24, mipWidth, mipHeight);
//     //             gl2.viewport(0, 0, mipWidth, mipHeight);

//     //             // Calcula a rugosidade para este nível de mipmap
//     //             const roughness = mip / (maxMipLevels - 1);
//     //             prefilterShader.setFloat("roughness", roughness);

//     //             // Renderiza as 6 faces do cubemap para o mipmap
//     //         for (let i = 0; i < 6; i++) {
//     //                 prefilterShader.setMat4("view", captureViews[i]);
//     //                 prefilterShader.setMat4("projection", Matrix4x4.perspective(60, 1.0, 0.1, 1.0));

//     //                 // Anexar a textura de cubemap ao framebuffer para a face i
//     //                 gl2.framebufferTexture2D(
//     //                     gl2.FRAMEBUFFER,
//     //                     gl2.COLOR_ATTACHMENT0,
//     //                     gl2.TEXTURE_CUBE_MAP_POSITIVE_X + i,
//     //                     prefilterMap,
//     //                     mip
//     //                 );

//     //                 gl2.framebufferRenderbuffer(
//     //                     gl2.FRAMEBUFFER,
//     //                     gl2.DEPTH_ATTACHMENT,
//     //                     gl2.RENDERBUFFER,
//     //                     captureRBO
//     //                 );

//     //                 // Verifique se o framebuffer está completo antes de continuar
//     //                 const framebufferStatus = gl2.checkFramebufferStatus(gl2.FRAMEBUFFER);
//     //                 if (framebufferStatus !== gl2.FRAMEBUFFER_COMPLETE) {
//     //                     console.error("Framebuffer não está completo. Status: " + framebufferStatus);
//     //                     throw new Error("Erro no framebuffer.");
//     //                 }

//     //                 gl2.clear(gl2.COLOR_BUFFER_BIT | gl2.DEPTH_BUFFER_BIT);
//     //                 renderCube();
//     //             }
//     //         }

//     //         WorldOptions.preFilterMap = prefilterMap;
//     //         gl2.bindFramebuffer(gl2.FRAMEBUFFER, null);
//     //     }


        


//     // }


