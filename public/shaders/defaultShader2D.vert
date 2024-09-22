
precision mediump float;
attribute vec3 a_position;
attribute vec2 a_textureCoord;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

varying vec2 v_texCoord;
varying vec2 v_position; 

void main() {

    vec4 worldPosition = u_modelMatrix * vec4(a_position, 1.0);
    gl_Position = u_projectionMatrix * u_viewMatrix * worldPosition;

    v_texCoord = a_textureCoord;
    v_position = worldPosition.xy;
}