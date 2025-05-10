#version 300 es
precision highp float;

in vec2 v_uv;
out vec4 outColor;

uniform sampler2D u_texture;

void main() {
    outColor = texture(u_texture, v_uv);
}
