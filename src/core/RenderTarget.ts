import Framebuffer from "./FrameBuffer";
import { IFrameBuffer } from "./ShadowTarget";

export default class RenderFrameBuffer implements IFrameBuffer {
    private gl: WebGL2RenderingContext;
    public framebuffer!: WebGLFramebuffer;
    public texture!: WebGLTexture;
    public depthBuffer!: WebGLRenderbuffer;
    public width: number;
    public height: number;

    constructor(gl: WebGL2RenderingContext, width: number, height: number) {
        this.gl = gl;
        this.width = width;
        this.height = height;
        this.createFramebuffer();
    }

    private createFramebuffer() {
        const gl = this.gl;
        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA32F, 
            this.width,
            this.height,
            0,
            gl.RGBA,
            gl.FLOAT,
            null
        );
        
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

        this.depthBuffer = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.depthBuffer);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT16, this.width, this.height);

        this.framebuffer = gl.createFramebuffer();
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.texture, 0);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthBuffer);

        Framebuffer.checkStatus(gl);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }

    public resize(newWidth: number, newHeight: number) {
        this.width = newWidth;
        this.height = newHeight;

        this.destroy();
        this.createFramebuffer();
    }

    public attach() {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.activeTexture(gl.TEXTURE0); 
        gl.bindTexture(gl.TEXTURE_2D, null);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        
    }

    public detach(): void {
        const gl = this.gl;
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    
    private destroy() {
        const gl = this.gl;
        gl.deleteFramebuffer(this.framebuffer);
        gl.deleteTexture(this.texture);
        gl.deleteRenderbuffer(this.depthBuffer);
    }
}
