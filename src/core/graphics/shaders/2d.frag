precision mediump float;

uniform sampler2D u_texture;
const vec4 u_outlineColor = vec4(1.0, 0.67, 0.07, 0.66);
uniform vec2 u_resolution;

varying vec2 v_texCoord;

uniform float u_outlineThickness; 


void main() {
    vec4 textureColor = texture2D(u_texture, v_texCoord);
    
    // if (textureColor.a < 0.1) { // Se o pixel é transparente
    //     vec2 texelSize = 1.0 / u_resolution;

    //     // Verificar pixels vizinhos em uma área fixa
    //     float alpha = 0.0;

    //     // Usar um valor fixo para amostras
    //     for (int x = -1; x <= 1; x++) {
    //         for (int y = -1; y <= 1; y++) {
    //             // Calcular a posição do texel
    //             vec4 neighborColor = texture2D(u_texture, v_texCoord + vec2(x, y) * texelSize);
    //             alpha += neighborColor.a; // Acumula a alpha dos vizinhos
    //         }
    //     }

    //     // Normalizar a alpha pelo número de amostras
    //     alpha /= 9.0; // 3x3 pixels (incluindo o próprio)

    //     // Se a média dos vizinhos for significativa, desenhe o contorno
    //     if (alpha > 0.1) {
    //         gl_FragColor = u_outlineColor; // Cor do contorno
    //     } else {
    //         discard; // Mantém o fundo
    //     }
    // } else {
    //     gl_FragColor = textureColor; // Cor original
    // }


    gl_FragColor = textureColor; // Cor original
}

