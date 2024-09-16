precision mediump float;

uniform sampler2D u_texture;
uniform vec4 u_color;
uniform vec2 u_lightPosition;
uniform float u_lightRadius;
uniform float u_lightIntensity;
uniform vec4 u_lightColor; // Defina como o amarelo claro

varying vec2 v_texCoord;
varying vec2 v_position;

const vec4 GLOBAL_LIGHT_COLOR = vec4(1.0, 1.0, 1.0, 1.0);

void main() {
    vec4 textureColor = texture2D(u_texture, v_texCoord);

    // Calcular a distância do fragmento para a fonte de luz
    float distance = length(v_position - u_lightPosition);

    // Atenuação baseada na distância da luz (diminui com a distância)
    float attenuation = max(1.0 - (distance / u_lightRadius), 0.0) * u_lightIntensity;

    // Aplicar a cor da luz com a textura e a cor da luz
    vec4 lighting = (textureColor * u_color * u_lightColor * attenuation) * GLOBAL_LIGHT_COLOR;

    // Definir a cor final
    gl_FragColor = lighting;
}
