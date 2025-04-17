#version 300 es
precision highp float;

const float PI = 3.1415926535897932384626433832795; 

// Função para inversão radical de VdC
float RadicalInverse_VdC(uint bits) 
{
    bits = (bits << 16u) | (bits >> 16u);
    bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
    bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
    bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
    bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
    return float(bits) * 2.3283064365386963e-10; // / 0x100000000
}

// Função Hammersley
vec2 Hammersley(uint i, uint N)
{
    return vec2(float(i)/float(N), RadicalInverse_VdC(i));
} 

// Função de amostragem GGX
vec3 ImportanceSampleGGX(vec2 Xi, vec3 N, float roughness) {
    float a = roughness * roughness;

    float phi = 2.0f * PI * Xi.x;
    float cosTheta = sqrt((1.0f - Xi.y) / (1.0f + (a * a - 1.0f) * Xi.y));
    float sinTheta = sqrt(1.0f - cosTheta * cosTheta);

    vec3 H_tangent = vec3(sinTheta * cos(phi), sinTheta * sin(phi), cosTheta);

    vec3 up = abs(N.z) < 0.999f ? vec3(0.0f, 0.0f, 1.0f) : vec3(1.0f, 0.0f, 0.0f);
    vec3 tangent = normalize(cross(up, N));
    vec3 bitangent = cross(N, tangent);

    return normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
}

float GeometrySchlickGGX(float NdotV, float roughness)
{
    float a = roughness;
    float k = (a * a) / 2.0;

    float nom   = NdotV;
    float denom = NdotV * (1.0 - k) + k;

    return nom / denom;
}

float GeometrySmith(vec3 N, vec3 V, vec3 L, float roughness)
{
    float NdotV = max(dot(N, V), 0.0);
    float NdotL = max(dot(N, L), 0.0);
    float ggx2 = GeometrySchlickGGX(NdotV, roughness);
    float ggx1 = GeometrySchlickGGX(NdotL, roughness);

    return ggx1 * ggx2;
} 

// Função para integrar o BRDF
vec4 IntegrateBRDF(float NdotV, float roughness)
{
    // Vetor de visão
    vec3 V = normalize(vec3(sqrt(1.0 - NdotV * NdotV), 0.0, NdotV));

    float A = 0.0;
    float B = 0.0;

    // Normal da superfície
    vec3 N = vec3(0.0, 0.0, 1.0);

    // Número de amostras para Monte Carlo
    const uint SAMPLE_COUNT = 1024u;

    // Loop para amostragem de Monte Carlo
    for(uint i = 0u; i < SAMPLE_COUNT; ++i)
    {
        // Geração de uma amostra usando a sequência Hammersley
        vec2 Xi = Hammersley(i, SAMPLE_COUNT);

        // Amostragem da micro-superfície usando o modelo GGX
        vec3 H = ImportanceSampleGGX(Xi, N, roughness);

        // Cálculo do vetor de luz L
        vec3 L = normalize(2.0 * dot(V, H) * H - V);

        // Produtos escalares
        float NdotL = max(L.z, 0.0);
        float NdotH = max(H.z, 0.0);
        float VdotH = max(dot(V, H), 0.0);

        // Se houver reflexão válida
        if(NdotL > 0.0)
        {
            // Cálculo do fator de geometria
            float G = GeometrySmith(N, V, L, roughness);

            // Cálculo da visibilidade no espaço de Fresnel
            float G_Vis = (G * VdotH) / (NdotH * NdotV);

            // Cálculo da cor do Fresnel
            float Fc = pow(1.0 - VdotH, 5.0);

            // Incremento de A e B
            A += (1.0 - Fc) * G_Vis;
            B += Fc * G_Vis;
        }
    }

    // Média dos resultados
    A /= float(SAMPLE_COUNT);
    B /= float(SAMPLE_COUNT);

    // Retorno dos coeficientes A e B
    return vec4(A, B, 0.0, 1.0);
}

// Declaração da variável de saída para cor do fragmento
out vec4 FragColor;  // Agora temos a variável FragColor como saída (deve ser vec4)
uniform vec3 cameraPos;
uniform float roughness;


in vec2 textCoords;

void main() 
{
    vec4 integratedBRDF = IntegrateBRDF(textCoords.x, roughness);
    FragColor = integratedBRDF;
}
