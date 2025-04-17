#version 300 es
precision mediump float;

layout(location = 0) in vec2 aPosition;  

out vec2 textCoords;

void main()
{
    textCoords = aPosition * 0.5 + 0.5; // Convertendo de [-1,1] para [0,1]
    gl_Position = vec4(aPosition, 0.0, 1.0);
}
