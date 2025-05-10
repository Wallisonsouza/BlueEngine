#version 300 es
precision highp float;

layout(location = 0) in vec3 a_position;

uniform mat4 modelMatrix; 
uniform mat4 lightSpaceMatrix; 

void main() {
  gl_Position = lightSpaceMatrix * modelMatrix * vec4(a_position, 1.0);
}