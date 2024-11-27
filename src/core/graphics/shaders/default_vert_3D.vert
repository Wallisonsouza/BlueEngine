precision highp float;

attribute vec3 VERTEX_POSITION;
attribute vec3 VERTEX_NORMAL;
attribute vec2 TEXTURE_COORD;

uniform mat4 MODEL_MATRIX;
uniform mat4 VIEW_MATRIX;
uniform mat4 PROJECTION_MATRIX;
uniform mat4 u_inverseTransposeModel;

attribute vec3 a_tangent;
attribute vec3 a_bitangent;

varying vec3 vWorldPosition;
varying vec2 vTextureCoord;
varying vec3 v_tangent;
varying vec3 v_normal;
varying vec3 v_bitangent;


varying vec3 v_fragment_position;

varying float v_height;

void main() {
    // Transform the vertex position to world space
    vec4 fragPos = MODEL_MATRIX * vec4(VERTEX_POSITION, 1.0);
    v_fragment_position = fragPos.rgb; // Do not normalize
    v_height = VERTEX_POSITION.y;
    
    // Calculate the normal matrix and transform normal, tangent, and bitangent
    mat3 normalMatrix = mat3(u_inverseTransposeModel);
    v_normal = normalize(normalMatrix * VERTEX_NORMAL);
    v_tangent = normalize(normalMatrix * a_tangent);
    v_bitangent = normalize(cross(v_normal, v_tangent));

    // Transform the position to clip space
    vec4 modelViewProjection = PROJECTION_MATRIX * VIEW_MATRIX * fragPos;
    gl_Position = modelViewProjection;

    // Pass the texture coordinates to the fragment shader
    vTextureCoord = TEXTURE_COORD; // Do not normalize
}