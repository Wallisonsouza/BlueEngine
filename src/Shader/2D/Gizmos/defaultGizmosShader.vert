precision mediump float;

attribute vec3 a_position;
attribute vec3 a_normal;

uniform mat4 u_modelMatrix;
uniform mat4 u_viewMatrix;
uniform mat4 u_projectionMatrix;

varying vec3 vNormal;
varying vec3 vWorldPosition;

void main() {
    // Calcula a posição no mundo
    vec4 worldPosition = u_modelMatrix * vec4(a_position, 1.0);
    vWorldPosition = worldPosition.xyz;
    vNormal = mat3(u_modelMatrix) * a_normal;

    gl_Position = u_projectionMatrix * u_viewMatrix * worldPosition;
}
