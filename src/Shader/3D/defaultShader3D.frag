precision mediump float;

precision mediump float;
uniform sampler2D uTexture;
uniform vec4 uColor;
varying vec2 vTexCoord;

void main() {
    vec4 color = texture2D(uTexture, vTexCoord);
    
    gl_FragColor = color * uColor;
}
