precision highp float;

const vec3 LIGHT_COLOR = vec3(1.0);
const vec3 u_ambientLightColor = vec3(1.0);

uniform vec3 OBJECT_COLOR; 
uniform vec3 CAMERA_DIRECTION;
uniform vec3 LIGHT_POSITION;

varying vec3 vNormal;
varying vec3 vWorldPosition;

uniform bool ENABLE_ALBEDO;
uniform bool ENABLE_NORMAL_MAP;

uniform sampler2D MATERIAL_ALBEDO;
uniform sampler2D MATERIAL_NORMAL_MAP;

uniform float MATERIAL_ROUGHNESS;
uniform float MATERIAL_METALLIC;

const float PI = 3.14159265359;

varying vec2 vTextureCoord;

// Cálculo da difusão Oren-Nayar
float diffuseFactor(vec3 normal, vec3 viewDirection, vec3 lightDirection, float roughness) {
    float NdotL = max(dot(normal, lightDirection), 0.0);
    
    // Modelo de Oren-Nayar para difusão
    float sigma2 = roughness * roughness;
    float A = 1.0 - 0.5 * sigma2 / (sigma2 + 0.33);
    float B = 0.45 * sigma2 / (sigma2 + 0.09);

    float LdotV = max(dot(lightDirection, viewDirection), 0.0);
    float theta_i = acos(max(NdotL, 0.0));
    float theta_r = acos(max(dot(normal, viewDirection), 0.0));

    float alpha = max(theta_i, theta_r);
    float beta = min(theta_i, theta_r);

    float diffuse = A + B * max(0.0, LdotV) * sin(alpha) * tan(beta);

    return NdotL * diffuse;
}

vec3 fresnelSchlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(1.0 - max(cosTheta, 0.0), 5.0);
}

// Cook-Torrance BRDF
float DistributionGGX(vec3 normal, vec3 halfVector, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH = max(dot(normal, halfVector), 0.0);
    float NdotH2 = NdotH * NdotH;

    float denominator = NdotH2 * (a2 - 1.0) + 1.0;
    return a2 / (PI * denominator * denominator);
}

float GeometrySchlickGGX(float NdotV, float roughness) {
    float k = roughness / 2.0;
    return NdotV / (NdotV * (1.0 - k) + k);
}

float GeometrySmith(vec3 normal, vec3 lightDir, vec3 viewDir, float roughness) {
    float NdotL = max(dot(normal, lightDir), 0.0);
    float NdotV = max(dot(normal, viewDir), 0.0);
    float ggx2 = GeometrySchlickGGX(NdotL, roughness);
    float ggx1 = GeometrySchlickGGX(NdotV, roughness);
    return ggx1 * ggx2;
}

void main() {

    vec3 normal = normalize(vNormal);
    float metalic = MATERIAL_METALLIC;

    if (ENABLE_NORMAL_MAP) {
        vec3 normalMap = texture2D(MATERIAL_NORMAL_MAP, vTextureCoord).xyz;
        normalMap = normalize(normalMap * 2.0 - 1.0);
        normal = normalMap;
    }

    vec3 lightDirection = normalize(LIGHT_POSITION - vWorldPosition);
    vec3 viewDirection = normalize(CAMERA_DIRECTION - vWorldPosition);
    
    float ambientStrength = 0.1;
    vec3 ambientLight = u_ambientLightColor * (ambientStrength * (1.0 - max(dot(normal, lightDirection), 0.0)));

    // Cálculo da iluminação difusa realista (Oren-Nayar)
    float diffuse = diffuseFactor(normal, viewDirection, lightDirection, MATERIAL_ROUGHNESS);
    
    // Cálculo da reflexão especular usando Cook-Torrance
    vec3 halfVector = normalize(lightDirection + viewDirection);
    float D = DistributionGGX(normal, halfVector, MATERIAL_ROUGHNESS);
    float G = GeometrySmith(normal, lightDirection, viewDirection, MATERIAL_ROUGHNESS);
    vec3 F0 = mix(vec3(0.04), texture2D(MATERIAL_ALBEDO, vec2(vWorldPosition.x, vWorldPosition.y)).rgb, metalic);
    vec3 F = fresnelSchlick(max(dot(halfVector, viewDirection), 0.0), F0);

    // Verifica divisão por zero
    float denom = 4.0 * max(dot(normal, lightDirection), 0.0) * max(dot(normal, viewDirection), 0.0);
    vec3 specular = (denom > 0.0) ? (D * G * F) / denom : vec3(0.0);

    // Resultados finais da iluminação
    vec3 diffuseLight = LIGHT_COLOR * diffuse;
    vec3 specularLight = LIGHT_COLOR * specular;

    // Cor final da iluminação sem Albedo
    vec3 finalColor = (ambientLight + diffuseLight + specularLight);


    if (ENABLE_ALBEDO) {
        vec3 albedoColor = texture2D(MATERIAL_ALBEDO, vTextureCoord ).rgb;
        finalColor *= albedoColor;
    }

    // Define a cor final do fragmento
    gl_FragColor = vec4(finalColor, 1.0);
}
