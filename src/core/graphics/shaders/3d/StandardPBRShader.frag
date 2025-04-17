#version 300 es
precision mediump float;

const float EPSILON = 1e-6f;
const float PI = 3.1415926535897932384626433832795;


const int BASE_COLOR = 1 << 0;          // 00001 (1)
const int NORMAL_MAP = 1 << 1;          // 00010 (2)
const int METALLIC_ROUGHNESS = 1 << 2;  // 00100 (4)
const int ENVIRONMENT_TEXTURE = 1 << 3; // 01000 (8)
const int EMISSIVE = 1 << 4;            // 10000 (16)
const int PREFILTER_FLAG = 1 << 5;      // 100000 (32)
const int SKY_BOX = 1 << 6;


const int COMBINED = 0;
const int NORMAL = 1;
const int POSITION = 2;
const int EMISSION = 3;
const int AO = 4;

uniform int u_lightCount;
uniform int u_renderPass;
uniform vec3 u_viewPosition;

struct PassData {
    vec3 fragment;
    vec2 uv;
    vec3 tangent;
    vec3 bitangent;
    vec3 normal;
    mat4 projection;
};

struct Light {
    vec3 position;
    vec3 color;
    float angle;
    float intensity;
    vec3 radiance;
    float radius;
    vec3 direction;
    int type;
};

struct MaterialData {
    float roughness;
    float metalness;
    vec3 baseColor;
    float alpha;
    vec3 emissive;
    vec3 ao;
    vec3 brdf;
   
    vec3 specular;
    vec3 diffuse;
};


struct CameraData {
    vec3 viewDirection;
};

struct SurfaceData {
    vec3 normal;
    vec3 tangent;
};
 
MaterialData material;
CameraData camera;
SurfaceData surface;






uniform vec3 u_emissiveFactor; 



//#endregion

//#region TEXTURES

uniform int u_textureFlags;
uniform sampler2D u_metallicRoughnessTexture;
uniform sampler2D u_normalTexture;
uniform sampler2D u_emissiveTexture;
uniform sampler2D u_baseColorTexture;
// uniform sampler2D u_lut;
// uniform samplerCube u_skyBox;
//#endregion


const int MAX_LIGHTS = 100;

in PassData pass;
uniform Light u_lights[MAX_LIGHTS];

layout(std140) uniform MaterialUniform {
    vec3 u_color;  
    float u_alpha;     
    float u_metallic;   
    float u_roughness;
    float u_ior;  
  
};


out vec4 FragColor;

float linear_rgb_to_srgb(float color) {

    if(color < 0.0031308f) {
        return (color < 0.0f) ? 0.0f : color * 12.92f;
    }

    return 1.055f * pow(color, 1.0f / 2.4f) - 0.055f;
}

float srgb_to_linear_rgb(float color) {
    if(color <= 0.04045f) {
        return color / 12.92f;
    }
    return pow((color + 0.055f) / 1.055f, 2.4f);
}

vec3 linear_rgb_to_srgb(vec3 color) {
    return vec3(linear_rgb_to_srgb(color.r), linear_rgb_to_srgb(color.g), linear_rgb_to_srgb(color.b));
}

vec3 srgb_to_linear_rgb(vec3 color) {
    return vec3(srgb_to_linear_rgb(color.r), srgb_to_linear_rgb(color.g), srgb_to_linear_rgb(color.b));
}

vec2 spherical_mapping(vec3 normal) {
    // Cálculo do ângulo azimutal (phi) e ângulo polar (theta)
    float phi = atan(normal.z, normal.x);  // Ângulo azimutal
    float theta = acos(normal.y);           // Ângulo polar

    // Normaliza para coordenadas UV
    float u = (phi + PI) / (2.0f * PI);  // Mapeia de [-PI, PI] para [0, 1]
    float v = theta / PI;                // Mapeia de [0, PI] para [0, 1]

    return vec2(u, v);  // Retorna as coordenadas UV
}

float pow_2(float value) {
    return value * value;
}
vec3 pow_2(vec3 value) {
    return value * value;
}
vec3 sRGB2Lin(vec3 col) {
    return pow_2(col);
}

float pow5(float value) {
    return value * value * value * value * value;
}

vec3 fresnelSchlick(vec3 F0, float HdotV, float roughness) {
    return F0 + (max(vec3(1.0 - roughness), F0) - F0) * pow(clamp(1.0 - HdotV, 0.0, 1.0), 5.0);
}

//------------------------DIFFUSE-------------------------------
vec3 orenNayar(vec3 albedo, vec3 lightDir, vec3 viewDir, vec3 normal, float roughness) {
    float roughness2 = roughness * roughness;

    float NdotL = max(dot(normal, lightDir), 0.0);
    float NdotV = max(dot(normal, viewDir), 0.0);

    float thetaV = acos(NdotV);
    float thetaL = acos(NdotL);
    float alpha = max(thetaV, thetaL);
    float beta  = min(thetaV, thetaL);

    float A = 1.0 - 0.5 * (roughness2 / (roughness2 + 0.33));
    float B = 0.45 * (roughness2 / (roughness2 + 0.09));

    vec3 LperpN = normalize(lightDir - NdotL * normal);
    vec3 VperpN = normalize(viewDir - NdotV * normal);
    float cosPhiDiff = max(dot(LperpN, VperpN), 0.0);

    float C = sin(alpha) * tan(beta);
    
    vec3 diffuse = albedo * (A + B * cosPhiDiff * C);
    return diffuse * NdotL;
}

float geometrySchlickGGX(float NdotX, float roughness) {
    float k = (roughness * roughness) / 2.0f;
    return NdotX / (NdotX * (1.0f - k) + k);
}

float geometrySmith(float NdotL, float NdotV, float roughness) {
    float ggx1 = geometrySchlickGGX(NdotV, roughness);
    float ggx2 = geometrySchlickGGX(NdotL, roughness);
    return ggx1 * ggx2;
}

float distributionGGX(float NdotH, float roughness) {
    float a = roughness * roughness;
    float a2 = a * a;
    float NdotH2 = NdotH * NdotH;
    float denom = (NdotH2 * (a2 - 1.0f) + 1.0f);
    return a2 / (PI * denom * denom);
}

//----------------------BRDF---------------------------------

float F0_from_ior(float eta) {
    return pow_2((eta - 1.0f) / (eta + 1.0f));
}

vec3 F0FromIOR(float eta) {
     return vec3( pow_2((eta - 1.0f) / (eta + 1.0f)));
}

vec3 safe_normalize(vec3 v) {
    float len = length(v);
    return len > 1e-6f ? v / len : vec3(0.0f, 0.0f, 0.0f);
}
float maxComponent(vec3 v) {
    return max(v.r, max(v.g, v.b));
}

float clamp01(float v) {
    return clamp(v, 0.0f, 1.0f);
}


vec3 reinhardTonemap(vec3 color) {
    return color / (color + vec3(1.0));
}

vec3 fresnel(vec3 F0, float HdotV) {
    float power = pow(1.0 - HdotV, 5.0);
    return F0 + (vec3(1.0) - F0) * power;
}

vec3 gammaCorrection(vec3 color, float gamma) {
    return pow(color, vec3(1.0 / gamma));
}




vec3 ACESFilm(vec3 x) {
     const float a = 2.51;
    const float b = 0.03;
    const float c = 2.43;
    const float d = 0.59;
    const float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d ) + e), 0.0, 1.0);
}

vec3 cookTorranceBRDF(
    vec3 viewDirection,
    vec3 surfaceNormal,
    vec3 lightDirection,
    vec3 albedo,
    float roughness,
    float metalness,
    float ior
) {
    vec3 halfVector = normalize(lightDirection +viewDirection);

    float NdotL = clamp(dot(surfaceNormal, lightDirection), 0.0, 1.0);
    if(NdotL > 0.0) {
        float NdotV = clamp(dot(surfaceNormal, viewDirection), 0.0, 1.0);
        float NdotH = clamp(dot(surfaceNormal, halfVector), 0.0, 1.0);
        float HdotV = clamp(dot(halfVector, viewDirection), 0.0, 1.0);

        // 🔹 Fresnel usando F0 correto
        vec3 F0 = mix(F0FromIOR(ior), albedo, metalness);
        vec3 F = fresnelSchlick(F0, HdotV, roughness);

        // 🔹 Distribuição de microfacetas (D) e oclusão geométrica (G)
        float D = distributionGGX(NdotH, roughness);
        float G = geometrySmith(NdotL, NdotV, roughness);

        // 🔹 Correção do denominador
        float denominator = 4.0 * max(NdotL, EPSILON) * max(NdotV, EPSILON);
        vec3 specular = (D * G * F) / denominator;



        vec3 kd = mix(vec3(1.0) - F, vec3(0.0), material.metalness); 


        vec3 diffuse = orenNayar(albedo, 
                                lightDirection, 
                                viewDirection,
                                surfaceNormal, 
                                roughness);
                                
        vec3 diffuseBRDF = kd * diffuse * albedo;
        return ( diffuseBRDF + specular) * NdotL;
    }

    return vec3(0);
}
 

void processMetallicRoughness(
    in vec2 textureCoordinates,
    in sampler2D metallicRoughnessSampler,
    in float metallicScale,
    in float roughnessScale,
    out float metallicValue,
    out float roughnessValue,
    out vec3 ambientOcclusionValue
) {
    vec4 sampledTexture = texture(metallicRoughnessSampler, textureCoordinates);

    metallicValue = clamp(sampledTexture.b * metallicScale, 0.0, 1.0);
    roughnessValue = clamp(sampledTexture.g * roughnessScale, 0.0, 1.0);
    ambientOcclusionValue = vec3(clamp(sampledTexture.r, 1e-4, 1.0));
}

void processNormalMap(
    in vec2 textureCoordinates,
    in sampler2D normalMapSampler,
    in vec3 surfaceTangent,
    in vec3 surfaceBitangent,
    in vec3 surfaceNormal,
    out vec3 transformedNormal
) {
    vec3 sampledNormal = texture(normalMapSampler, textureCoordinates).rgb;
    sampledNormal.g = 1.0 - sampledNormal.g;
    sampledNormal = normalize(sampledNormal * 2.0 - 1.0);

    mat3 tangentToWorldMatrix = mat3(surfaceTangent, surfaceBitangent, surfaceNormal);
    transformedNormal = normalize(tangentToWorldMatrix * sampledNormal);
}

void processBaseColor(
    in vec2 textureCoordinates,
    in sampler2D baseColorSampler,
    in vec3 baseColorMultiplier,
    in float alphaMultiplier,
    out vec3 computedBaseColor,
    out float computedAlpha
) {
    vec4 sampledColor = texture(baseColorSampler, textureCoordinates);

    computedBaseColor = clamp(sampledColor.rgb * baseColorMultiplier, 0.0, 1.0);
    computedAlpha = clamp(sampledColor.a * alphaMultiplier, 1e-4, 1.0);
}

void processEmissiveTexture(
    in vec2 textureCoordinates,
    in sampler2D emissiveSampler,
    in vec3 emissiveFactor,
    out vec3 computedEmissive
) {
    vec4 sampledEmissive = texture(emissiveSampler, textureCoordinates);
    computedEmissive = sampledEmissive.rgb * emissiveFactor;
}

void processData(
    out MaterialData materialData,
    out SurfaceData surfaceData,
    in vec2 textureCoordinates,
    in int textureFlags,
    in sampler2D metallicRoughnessSampler,
    in float metallicFactor,
    in float roughnessFactor,
    in sampler2D baseColorSampler,
    in vec3 baseColorFactor,
    in float alphaFactor,
    in sampler2D normalMapSampler,
    in vec3 surfaceTangent,
    in vec3 surfaceBitangent,
    in vec3 surfaceNormal,
    in sampler2D emissiveSampler,
    in vec3 emissiveFactor
) {
    
    materialData.metalness = clamp(metallicFactor, 0.0, 1.0);
    materialData.roughness = clamp(roughnessFactor, 0.0, 1.0);
    materialData.baseColor = clamp(baseColorFactor, 0.0, 1.0);
    materialData.alpha = clamp(alphaFactor, 1e-4, 1.0);
    surfaceData.normal = safe_normalize(surfaceNormal);
    materialData.emissive = emissiveFactor;
    materialData.ao = vec3(1.0);


    // Processar metallic/roughness texture
    if ((textureFlags & METALLIC_ROUGHNESS) != 0) {
        processMetallicRoughness(
            textureCoordinates,
            metallicRoughnessSampler,
            metallicFactor,
            roughnessFactor,
            materialData.metalness,
            materialData.roughness,
            materialData.ao
        );
    }

    // Processar base color texture
    if ((textureFlags & BASE_COLOR) != 0) {
        processBaseColor(
            textureCoordinates,
            baseColorSampler,
            baseColorFactor,
            alphaFactor,
            materialData.baseColor,
            materialData.alpha
        );
    }

    // Processar normal map
    if ((textureFlags & NORMAL_MAP) != 0) {
        processNormalMap(
            textureCoordinates,
            normalMapSampler,
            surfaceTangent,
            surfaceBitangent,
            surfaceNormal,
            surfaceData.normal
        );
    }

    // Processar emissive texture
    if ((textureFlags & EMISSIVE) != 0) {
        processEmissiveTexture(
            textureCoordinates,
            emissiveSampler,
            emissiveFactor,
            materialData.emissive
        );
    }
}

vec3 fresnel(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

void combinedPass() {
    float ior = u_ior;
    camera.viewDirection = normalize(u_viewPosition - pass.fragment);

    vec3 a = vec3(0);
     vec3 direcionalColor = vec3(0);
    for (int i = 0; i < u_lightCount; i++) {
        Light light = u_lights[i];

        if (light.type == 0) { // Luz Ambiente
            
            vec3 ambientColor = light.color * light.intensity;
            vec3 diffuseColor = srgb_to_linear_rgb(material.baseColor);
            
            vec3 normal = normalize(surface.normal);
            vec3 viewDir = normalize(camera.viewDirection);

            // Calcula o F0 com base no IOR
            vec3 F0 = vec3(F0_from_ior(u_ior));

            vec3 fresnel = fresnel(max(dot(viewDir, normal), 0.0), F0);
            float specularFactor = (1.0 - material.roughness) * fresnel.x;

            
         
           a += diffuseColor * ambientColor; 
           a += ambientColor * specularFactor;
        }

       
         if (light.type == 1) { // Luz Direcional
            vec3 lightDir = normalize(-light.direction);

            vec3 brdf = cookTorranceBRDF(
                camera.viewDirection,
                surface.normal, 
                lightDir,
                material.baseColor,
                material.roughness, 
                material.metalness, 
                ior
            );

             direcionalColor += brdf * light.color * light.intensity;

        }
    }

    material.brdf =  direcionalColor + a;

   
}

void main() {
 
    processData(
        material, 
        surface,
        pass.uv, 
        u_textureFlags, 
        u_metallicRoughnessTexture,
        u_metallic, 
        u_roughness, 
        u_baseColorTexture, 
        u_color.rgb, 
        u_alpha,
        u_normalTexture, 
        pass.tangent, 
        pass.bitangent, 
        pass.normal, 
        u_emissiveTexture, 
        u_emissiveFactor
    );
    
 combinedPass();


    switch(u_renderPass) {
        case COMBINED:


      // 1. Calcular o BRDF e adicionar o Specular
        vec3 linearColor = material.brdf;  // Manter tudo linear
        vec3 tonemappedColor = reinhardTonemap(linearColor);         // Tonemapping no espaço linear
        vec3 srgbColor = linear_rgb_to_srgb(tonemappedColor); // Converter para sRGB no final
        FragColor = vec4(vec3(0.5), material.alpha);


            break;
         

        // case NORMAL:
        //     FragColor = vec4(material.surfaceNormal, 1.0f);
        //     break;

        // case POSITION:
        //     FragColor = vec4(pass.fragment, 1.0f);
        //     break;

        // case EMISSION:
        //     FragColor = vec4(material.emissive, material.alpha);
        //     break;

        // case AO:
        //     FragColor = vec4(vec3(material.ao.r), 1.0f);
        //     break;

        // default:
        //     FragColor = vec4(0.0f);
        //     break;
    }
}










// vec3 IBL(
//     vec3 normal,
//     vec3 viewDir,
//     samplerCube prefilterMap,
//     sampler2D irradianceMap,
//     float roughness,
//     vec3 F0
// ) {
//     float NdotV = clamp(dot(normal, viewDir), 0.0f, 1.0f);
//     vec3 reflectionVector = reflect(-viewDir, normal);

//     const float MAX_REFLECTION_LOD = 4.0f;
//     vec3 specularIBL = textureLod(prefilterMap, reflectionVector, roughness * MAX_REFLECTION_LOD).rgb;
//     vec3 F = fresnelSchlick(F0, NdotV, roughness);
//     vec3 specularColor = specularIBL * F;

//     vec3 reflectedDir = reflect(-viewDir, data.normal);
//     vec2 coords = spherical_mapping(reflectedDir);
//     vec3 diffuseIBL = texture(irradianceMap, coords).rgb;
//     vec3 kd = 1.0f - F;
//     vec3 diffuseColor = diffuseIBL * kd * F0;

//     return diffuseColor + specularColor;
// }
