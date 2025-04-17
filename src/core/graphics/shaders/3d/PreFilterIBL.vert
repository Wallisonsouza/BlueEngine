#version 300 es
precision mediump float;

layout(location = 0) in vec3 aPosition;  
layout(location = 1) in vec3 aNormal; 

out vec3 position; 
uniform mat4 view;
uniform mat4 projection;

void main()
{
    position = aPosition;
    vec4 position = projection * view * vec4(aPosition, 1.0);
    gl_Position = position; 
}
