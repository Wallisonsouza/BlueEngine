
attribute vec3 aPosition;
attribute vec2 aTexCoord;

uniform mat4 uModel;
uniform mat4 uView;
uniform mat4 uProjection;
uniform mat4 uShadowMatrix;

varying vec2 vTexCoord;
varying vec4 vShadowCoord;

void main() {
    vec4 worldPosition = uModel * vec4(aPosition, 1.0);
    
    vTexCoord = aTexCoord;
    vShadowCoord = uShadowMatrix * worldPosition;

    gl_Position = uProjection * uView * worldPosition;
}