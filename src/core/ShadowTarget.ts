import Display from "./components/Display";
import Framebuffer from "./FrameBuffer";
import RendererManager from "./managers/RendererManager";
import Shadow from "./Shadow";

export interface IFrameBuffer {
    attach(): void;
    detach(): void;
}

export default class ShadowFrameBuffer implements IFrameBuffer {

    private gl: WebGL2RenderingContext;
    public framebuffer!: WebGLFramebuffer;
    public static depthTexture: WebGLTexture;
    public size: number;

    constructor(gl: WebGL2RenderingContext,  size: number) {
        this.gl = gl;
        this.size = size;
        ShadowFrameBuffer.depthTexture = this.create();
    }
  

    private create() {
        this.framebuffer = this.gl.createFramebuffer();
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, this.framebuffer);

       const depthTexture = this.gl.createTexture();
        this.gl.bindTexture(this.gl.TEXTURE_2D, depthTexture);
        this.gl.texImage2D(
            this.gl.TEXTURE_2D,
            0,
            this.gl.DEPTH_COMPONENT32F,
            this.size,
            this.size,
            0,
            this.gl.DEPTH_COMPONENT,
            this.gl.FLOAT,
            null,
        );
        
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MIN_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_MAG_FILTER, this.gl.NEAREST);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_S, this.gl.CLAMP_TO_EDGE);
        this.gl.texParameteri(this.gl.TEXTURE_2D, this.gl.TEXTURE_WRAP_T, this.gl.CLAMP_TO_EDGE);

        this.gl.framebufferTexture2D(
            this.gl.FRAMEBUFFER,
            this.gl.DEPTH_ATTACHMENT,
            this.gl.TEXTURE_2D,
            depthTexture,
            0,
        );

        this.gl.drawBuffers([this.gl.NONE]);

        Framebuffer.checkStatus(this.gl);
        this.gl.bindFramebuffer(this.gl.FRAMEBUFFER, null);
        return depthTexture;
    }

    public attach() {
        const gl = this.gl;
        gl.viewport(0, 0, this.size, this.size);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.framebuffer);
        gl.clear(gl.DEPTH_BUFFER_BIT);
        const renderers = RendererManager.getActiveRenderers();
        Shadow.render(gl, renderers);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        Display.applyResolution();
    }

    detach(): void {
        throw new Error("Method not implemented.");
    }
    
}
