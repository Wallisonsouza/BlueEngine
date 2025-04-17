#version 300 es
precision highp float;

layout(location = 0) in vec3 a_position;
layout(location = 1) in vec3 a_normal;
layout(location = 2) in vec2 a_uv;
layout(location = 3) in vec3 a_tangent;



layout(std140) uniform CameraUniform {
    mat4 u_camera_view_matrix;
    mat4 u_camera_projection_matrix;
};



uniform mat4 u_modelMatrix;

struct PassData {
    vec3 fragment;
    vec2 uv;
    vec3 tangent;
    vec3 bitangent;
    vec3 normal;
    mat4 projection;

};

out PassData pass;

void main() {

    vec4 fragPos = u_modelMatrix * vec4(a_position, 1.0);
    pass.fragment = fragPos.xyz;
    pass.uv = a_uv;
    pass.projection = u_camera_projection_matrix;
 
    mat3 normalMatrix = mat3(inverse(transpose(u_modelMatrix)));
 
    pass.normal = normalize(normalMatrix * a_normal);
    pass.tangent = normalize(normalMatrix * a_tangent);
    pass.bitangent = normalize(cross(pass.normal, pass.tangent));
    // pass.ao = computeAO(fragPos.xyz, pass.normal);
    vec4 viewPosition = u_camera_view_matrix * fragPos;
    vec4 modelViewProjection = u_camera_projection_matrix * viewPosition;

    gl_Position = modelViewProjection;
}
       
