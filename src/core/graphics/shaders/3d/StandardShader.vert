#version 300 es
precision lowp float;
layout(location = 0) in vec3 a_position;
uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

void main() {

    vec4 fragPos = u_model * vec4(a_position, 1.0);
    vec4 viewPosition = u_view * fragPos;
    vec4 modelViewProjection = u_projection * viewPosition;
    gl_Position = modelViewProjection;
}
      