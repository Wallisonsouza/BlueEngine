precision highp float;

attribute vec3 VERTEX_POSITION;
attribute vec3 VERTEX_NORMAL;
attribute vec2 TEXTURE_COORD;

uniform mat4 MODEL_MATRIX;
uniform mat4 VIEW_MATRIX;
uniform mat4 PROJECTION_MATRIX;

varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec2 vTextureCoord;


void main() {
  
    vec4 worldPosition = MODEL_MATRIX * vec4(VERTEX_POSITION, 1.0);
    vWorldPosition = worldPosition.xyz;
    
    vNormal = normalize(mat3(MODEL_MATRIX) * VERTEX_NORMAL);

    gl_Position = PROJECTION_MATRIX * VIEW_MATRIX * worldPosition;

    vTextureCoord = TEXTURE_COORD;
}
