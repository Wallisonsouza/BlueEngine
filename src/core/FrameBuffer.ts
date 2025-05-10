export default class Framebuffer {
    
    public static create(gl: WebGL2RenderingContext): WebGLFramebuffer | null {
        const framebuffer = gl.createFramebuffer();
        if (!framebuffer) {
            console.error("Não foi possível criar o framebuffer.");
            return null;
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);

        const ok = this.checkStatus(gl);
        if (!ok) {
            gl.deleteFramebuffer(framebuffer);
            return null;
        }

        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return framebuffer;
    }

    public static checkStatus(gl: WebGL2RenderingContext): boolean {
        const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
        if (status !== gl.FRAMEBUFFER_COMPLETE) {
            const hex = `0x${status.toString(16)}`;
            switch (status) {
                case gl.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:
                    console.error(`Framebuffer incompleto: attachment. Status: ${hex}`);
                    break;
                case gl.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:
                    console.error(`Framebuffer sem attachment. Status: ${hex}`);
                    break;
                case gl.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:
                    console.error(`Dimensões inconsistentes no framebuffer. Status: ${hex}`);
                    break;
                case gl.FRAMEBUFFER_UNSUPPORTED:
                    console.error(`Formato não suportado pelo framebuffer. Status: ${hex}`);
                    break;
                default:
                    console.error(`Framebuffer com erro desconhecido. Status: ${hex}`);
                    break;
            }
            return false;
        }
        return true;
    }
}
