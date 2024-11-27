

precision highp float;

const float PI = 3.1415926535897932384626433832795;
const  float EPSILON = 1e-5;
const vec3 lightColor = vec3(1.0);
const vec3 specColor = vec3(1.0);
const float specular_ior_level = 0.5;
uniform vec3 u_cameraDir;
uniform vec3 u_cameraPos;
uniform vec3 u_lightDir; 
uniform float u_time;
varying vec3 vWorldPosition;
varying vec2 vTextureCoord;
varying vec3 v_normal;
varying vec3 v_tangent;
varying vec3 v_fragment_position;
varying vec3 v_bitangent;
varying float v_height;
uniform int u_render_pass;


struct Light {
    vec3 position;
    vec3 color;
    float angle;
    float intensity;

    float radius;
    vec3 direction;
    float innerConeAngle;
    float outerConeAngle;

    bool isPointLight;
    bool isDirectional;
    bool isSpotLight;
};

struct Material {
    vec3 baseColor;
    float metallic;
    float roughness;
    float alpha;
    float ior;
    
    sampler2D baseColorTexture;
    sampler2D metallicRoughnessTexture;
    sampler2D environmentTexture;
    sampler2D normalTexture;

    bool hasBaseColorTexture;
    bool hasMetallicRoughnessTexture;
    bool hasEnvironmentTexture;
    bool hasNormalTexture;
 

};

const int MAX_LIGHTS = 10;
uniform Light u_lights[10]; 
uniform Material u_material;


vec3 linearToSRGB(vec3 linearColor) {
    vec3 low = linearColor * 12.92;
    vec3 high = 1.055 * pow(linearColor, vec3(1.0 / 2.4)) - 0.055;
    return mix(low, high, step(0.0031308, linearColor));
}


// vec3 calculateLighting(vec3 normal, vec3 viewDir, vec3 baseColor, float metallic, float roughness) {
//     vec3 color = vec3(0.0);  // Cor final

//     // Termo Fresnel (F0) baseado na metalicidade
//     vec3 F0 = vec3(calculateF0(1.5)); 
//     F0 = mix(F0, baseColor, metallic);

//     for (int i = 0; i < MAX_LIGHTS; ++i) {
//         Light light = u_lights[i];
        
//         // Direção e distância da luz
//         vec3 lightDir = normalize(-light.direction);
//         float distance = length(light.position - vFragPos);

//         // Calcula o fator de atenuação com base na distância e no raio
//         // float attenuation = clamp(1.0 - (distance / light.radius), 0.0, 1.0);
//         float NdotL = max(dot(normal, lightDir), 0.0);

//         // Cálculo da luz difusa, incluindo cor, intensidade e atenuação da luz
//         vec3 diffuse = LambertDiffuse(normal, lightDir) * baseColor * NdotL * light.color ;

//         // Cálculo especular usando BRDF, incluindo NdotL, cor, intensidade e atenuação da luz
//         vec3 specular = BRDF(lightDir, viewDir, normal, F0, roughness) * NdotL * light.color;

//         // Acumula a contribuição da luz na cor final
//         color += (diffuse + specular);
//     }

//     return color;
// }
vec2 sphericalMapping(vec3 normal) {
    float phi = atan(normal.z, normal.x);  // Ângulo azimutal (em torno do eixo Y)
    float theta = acos(normal.y);           // Ângulo polar (em relação ao eixo Y)

    // Normaliza para coordenadas UV
    float u = (phi + PI) / (2.0 * PI);  // Mapeia -pi..pi para 0..1
    float v = theta / PI;                    // Mapeia 0..pi para 0..1

    return vec2(u, v);
}

vec3 calculateSkyColor(vec3 normal) {
    
    vec3 skyColor = vec3(1.0);

    if(u_material.hasEnvironmentTexture) {
        vec2 uv = sphericalMapping(normal);
        skyColor = texture2D(u_material.environmentTexture, uv).rgb;
    }

    return skyColor;
}

float schlick_fresnel_approximation(float F0, float cosTheta)
{
    float oneMinusLdotH = 1.0 - cosTheta;
    float factor = oneMinusLdotH * oneMinusLdotH * oneMinusLdotH * oneMinusLdotH * oneMinusLdotH;
    return F0 + (1.0 - F0) * factor;
}

vec3 calculateSunLighting(vec3 normal, vec3 viewDir, vec3 baseColor, float metallic, float roughness) {
    vec3 color = vec3(0.0);  

   
    for (int i = 0; i < MAX_LIGHTS; ++i) {
        Light light = u_lights[i];
        vec3 lightDir = normalize(light.direction);
       
    }

    return color;
    
    // // Reflexão ambiente (IBL)
    // vec3 reflectedDir = reflect(-viewDir, normal);
    // vec3 skyColor = vec3(1.0);  // Cor padrão do céu

    // if (u_material.hasEnvironmentTexture) {
    //     vec2 envUV = sphericalMapping(reflectedDir);
    //     skyColor = texture2D(u_material.environmentTexture, envUV).rgb;
    // }

    // // Reflexão especular ambiente (afetada por roughness)
    // vec3 envSpecular = fresnelSchlickRoughness(max(dot(normal, viewDir), 0.0), F0, roughness) * skyColor * (1.0 - roughness);

    // // Somente materiais metálicos contribuem para reflexões especulares
    // color += envSpecular * metallic;
}

//------------------------DIFFUSE-------------------------------
vec3 Diffuse_OrenNayar(vec3 albedo, vec3 lightDir, vec3 viewDir, vec3 normal, float roughness) {
    float sigma2 = roughness * roughness;

    // Fatores A e B
    float A = 1.0 - (sigma2 / (2.0 * (sigma2 + 0.33)));
    float B = 0.45 * sigma2 / (sigma2 + 0.09);

    // Ângulos necessários
    float NdotL = max(dot(normal, lightDir), 0.05); // Evita NdotL = 0
    float NdotV = max(dot(normal, viewDir), 0.0);

    vec3 lightReflect = reflect(-lightDir, normal);
    float VdotR = max(dot(viewDir, lightReflect), 0.0);

    // Termo geométrico
    float angle = max(0.0, VdotR);
    float sinThetaL = sqrt(max(0.0, 1.0 - NdotL * NdotL));
    float sinThetaV = sqrt(max(0.0, 1.0 - NdotV * NdotV));

    // Cálculo da intensidade difusa
    float diff = NdotL * (A + B * angle * sinThetaL * sinThetaV);

    return diff * albedo;
}

//-------------BRDF COMPONENTS-----------------------
float safe_divide(float numerator, float denominator, float epsilon) {

    if (numerator == 0.0 || denominator == 0.0) {
        return 0.0;
    }
    
    return numerator / max(denominator, epsilon);
}

vec3 safe_divide(vec3 numerator, float denominator, float epsilon) {
   
    if (length(numerator) == 0.0 || denominator == 0.0) {
        return vec3(0.0);  
    }

    return numerator / max(denominator, epsilon);
}



float G_SchlickGGX(float NdotX, float roughness) {
    float k = (roughness * roughness) / 2.0;

    float numerator = NdotX;
    float denominator = NdotX * (1.0 - k) + k; 
   
    return numerator / denominator;
} 


float D_GGX(float NdotH, float roughness) {
    // Quadrado de roughness para obter alpha
    float alpha = roughness * roughness; 

    // Cálculo de NdotH ao quadrado
    float NdotH2 = NdotH * NdotH;

    // Numerador
    float numerator = alpha * alpha;

    // Cálculo do denominador
    float denominator = NdotH2 * (alpha - 1.0) + 1.0;

    // Garantir que o denominador não seja zero ou muito pequeno
    denominator = max(EPSILON, denominator);

    // Multiplicar por PI e elevar ao quadrado
    denominator = PI * denominator * denominator;
  
    // Retornar o valor final
    return numerator / denominator;
}


float G_Smith(float NdotL, float NdotV, float roughness) {
    float G1_L = G_SchlickGGX(NdotL, roughness);
    float G1_V = G_SchlickGGX(NdotV, roughness);
    return G1_L * G1_V;
}

vec3 F_Schlick(float cosTheta, vec3 F0) {
    return F0 + (1.0 - F0) * pow(1.0 - cosTheta, 5.0);
}

//----------------------BRDF---------------------------------

float ior_from_F0(float F0)
{
  float f = sqrt(clamp(F0, 0.0, 0.99));
  return (-f - 1.0) / (f - 1.0);
}

float F0_from_ior(float eta)
{
  float f0 = (eta - 1.0) / (eta + 1.0);
  return f0 * f0;
}

bool isLessThan(vec3 vector, float threshold) {
    return  (vector.x < threshold) && 
            (vector.y < threshold) && 
            (vector.z < threshold);
}

vec3 Diffuse_Lambert(vec3 albedo, vec3 L, vec3 N) {
    float NdotL = clamp(dot(N, L), 0.0, 1.0);
    return albedo * NdotL;
}


vec3 BRDF(
    vec3 lightDir, 
    vec3 viewDir, 
    vec3 normal, 
    float ior, 
    float roughness,
    float metallic, 
    vec3 albedo, 
    vec3 lightColor, 
    vec3 reflection_tint,
    float lightAngle
) {

    
    float eta = ior;

    float f0 = F0_from_ior(eta);
    if (specular_ior_level != 0.5) {
      f0 *= 2.0 * specular_ior_level;
      eta = ior_from_F0(f0);
      if (ior < 1.0) {
        eta = 1.0 / eta;
      }
    }
    
    vec3 F0 = vec3(f0) * reflection_tint;
    F0 = clamp(F0, vec3(0.0), vec3(1.0));
   
    vec3 halfVector = normalize(lightDir + viewDir);

    // Calcula os ângulos de incidência e visão
    float NdotL = clamp(dot(normal, lightDir), 0.0, 1.0);  // Incidência da luz sobre a superfície
    float NdotV = clamp(dot(normal, viewDir), 0.0, 1.0);    // Ângulo entre a visão e a superfície
    float NdotH = clamp(dot(normal, halfVector), 0.0, 1.0);  // Ângulo entre a normal e o vetor médio
    float VdotH = clamp(dot(viewDir, halfVector), 0.0, 1.0); // Ângulo entre a direção da visão e o vetor médio

    

    float D = D_GGX(NdotH, roughness); 
    float G = G_Smith(NdotL, NdotV, roughness);  
    vec3 F = F_Schlick(VdotH, F0); 

    vec3 numerator = (G * D * F);
    float denominator = 4.0 * NdotL * NdotV;

    vec3 specular = safe_divide(numerator, denominator, EPSILON);
    vec3 diff = Diffuse_OrenNayar(albedo, lightDir, viewDir, normal, roughness);


    return diff + specular;
}


void calculate_metallic_roughness(Material material, vec2 textureCoord,  out float roughness, out float metallic) {
    if (material.hasMetallicRoughnessTexture) {
        vec4 metallicRoughness = texture2D(material.metallicRoughnessTexture, textureCoord);
        roughness = clamp(metallicRoughness.g, 0.0, 1.0); 
        metallic = clamp(metallicRoughness.r, 0.0, 1.0);
    } else {
        roughness = material.roughness;
        metallic = material.metallic;
    }
}









// Função para gerar o movimento das ondas com o modelo de Gerstner
vec3 gerstnerWave(vec3 position, float time, float amplitude, float wavelength, float speed, vec2 direction) {
    float k = 2.0 * 3.14159 / wavelength;  // Número de onda
    float phase = k * (dot(position.xz, direction)) - speed * time;  // Fase da onda
    float height = amplitude * sin(phase);  // Altura da onda
    
    // Calculando a normal: derivada da função de altura em relação a x e z
    float dHeight_dx = amplitude * k * cos(phase) * direction.x;
    float dHeight_dz = amplitude * k * cos(phase) * direction.y;

    // A normal é perpendicular à superfície da onda
    vec3 normal = normalize(vec3(dHeight_dx, 1.0, dHeight_dz));

    // A posição da onda
    vec3 displacedPosition = vec3(position.x, position.y + height, position.z);

    // Retornar tanto a nova posição da onda quanto a normal calculada
    return displacedPosition;
}

// Função para combinar várias ondas de Gerstner (no caso, 3 ondas diferentes)
vec3 getWaterSurface(vec3 position, float time, out vec3 normal) {
    vec3 finalPosition = position;
    normal = vec3(0.0);

    // Direções e parâmetros para várias ondas
    vec2 waveDirection1 = normalize(vec2(1.0, 0.5));  // Direção da onda 1
    vec2 waveDirection2 = normalize(vec2(-0.5, 1.0)); // Direção da onda 2
    vec2 waveDirection3 = normalize(vec2(0.7, -0.7)); // Direção da onda 3
    
    // Amplitude, comprimento de onda, velocidade para cada onda
    float amplitude1 = 0.1, wavelength1 = 0.5, speed1 = 2.0;
    float amplitude2 = 0.15, wavelength2 = 0.6, speed2 = 1.5;
    float amplitude3 = 0.05, wavelength3 = 0.3, speed3 = 2.5;

    // Somando o efeito de várias ondas e acumulando a normal
    vec3 pos1;
    pos1 = gerstnerWave(finalPosition, time, amplitude1, wavelength1, speed1, waveDirection1);
    finalPosition = pos1;

    vec3 pos2;
    pos2 = gerstnerWave(finalPosition, time, amplitude2, wavelength2, speed2, waveDirection2);
    finalPosition = pos2;

    vec3 pos3;
    pos3 = gerstnerWave(finalPosition, time, amplitude3, wavelength3, speed3, waveDirection3);
    finalPosition = pos3;

    // Calcular a normal média de todas as ondas
    normal = normalize(normal);

    return finalPosition;
}

// Função para gerar a espuma na praia
float foamEffect(vec3 position, float time) {
    float waterHeight = position.y;
    float foamThreshold = 0.05; // Limite da altura para a espuma aparecer (próximo da linha d'água)
    float foamFalloff = 0.5;   // Intensidade da espuma diminui com a distância da linha d'água
    
    // Se a altura da água estiver perto da praia (na zona de quebra das ondas), geramos espuma
    if (waterHeight < foamThreshold && waterHeight > 0.0) {
        // Gerar espuma de forma suave usando um padrão de ruído ou seno para variações
        return max(sin(time * 3.0) * 0.5, 0.0) * (1.0 - waterHeight * foamFalloff); // Intensidade da espuma
    }
    return 0.0; // Fora da área da espuma
}

// Função para calcular a cor da água com espuma
vec3 getWaterColor(float height, vec3 position, float time) {
    // Definindo as cores para diferentes profundidades
    vec3 shallowWaterColor = vec3(0.0, 0.5, 1.0);  // Cor da água rasa (azul claro)
    vec3 deepWaterColor = vec3(0.0, 0.2, 0.5);     // Cor da água profunda (azul escuro)
    vec3 foamColor = vec3(1.0, 1.0, 1.0);           // Cor da espuma (branco)

    // Calcular a nova posição da água com base nas ondas de Gerstner
    vec3 newPosition;
    vec3 normal;
    newPosition = getWaterSurface(position, time, normal);
    
    // Calcular a intensidade da espuma
    float foam = foamEffect(newPosition, time);
    
    // Se a água estiver na linha da água, adicionar a espuma
    if (newPosition.y < 0.1 && newPosition.y > 0.0) {
        return mix(shallowWaterColor, foamColor, foam); // Mistura a cor da água rasa com a espuma
    }

    // Para águas mais profundas, usamos uma cor mais escura
    if (newPosition.y < 0.0) {
        return deepWaterColor; // Cor de águas profundas
    }

    return shallowWaterColor; // Cor da água rasa
}

void main() {
    // Obter a cor da água com base na altura, posição e tempo
    vec3 waterColor = getWaterColor(v_height, v_fragment_position, u_time);

    // Calcular iluminação (opcional, por exemplo, para brilho ou reflexão)
    float lighting = max(dot(v_normal, vec3(0.0, 1.0, 0.0)), 0.0);
    
    // Aplicar iluminação à cor da água
    gl_FragColor = vec4(waterColor * lighting, 1.0);
}



// void main() {

 
//     vec3 viewDir = normalize(u_cameraPos - v_fragment_position);  

//     float roughness;
//     float metallic;
//     vec3 baseColor = u_material.baseColor;
//     vec3 normal = normalize(v_normal);  
//     calculate_metallic_roughness(u_material, vTextureCoord, roughness, metallic);

    

//     if (u_material.hasNormalTexture) {
//         mat3 TBN = mat3(
//             normalize(v_tangent), 
//             normalize(v_bitangent), 
//             normalize(v_normal)
//         );

//         // Extrair e ajustar o normal map
//         vec3 normalMap = texture2D(u_material.normalTexture, vTextureCoord).rgb;
//         normalMap = normalMap * 2.0 - 1.0; 
//         normal = normalize(TBN * normalMap); 
//     }

//     if (u_material.hasBaseColorTexture) {
//         vec4 textureColor = texture2D(u_material.baseColorTexture, vTextureCoord);
//         baseColor *= textureColor.rgb;
//         if(textureColor.a < 0.1) {
//             discard;
//         }
//     }


//     vec3 specularColor = BRDF(
//         normalize(-u_lights[0].direction),
//         viewDir,
//         normal,
//         100.5,
//         roughness,
//         metallic,
//         baseColor,
//         u_lights[0].color,
//         vec3(1),
//         180.0
//     );

//     gl_FragColor = vec4( normal, u_material.alpha);
//     if (gl_FragColor.a < 0.1) { 
//         discard;
//     } 
// }



























vec3 tint_from_color(vec3 color)
{
  float lum = dot(color, vec3(0.3, 0.6, 0.1));  /* luminance approx. */
  return (lum > 0.0) ? color / lum : vec3(1.0); /* normalize lum. to isolate hue+sat */
}





// struct Closure {

// };

// void node_bsdf_principled(vec4 base_color,
//                           float metallic,
//                           float roughness,
//                           float ior,
//                           float alpha,
//                           vec3 N,
//                           float weight,
//                           float diffuse_roughness,
//                           float subsurface_weight,
//                           vec3 subsurface_radius,
//                           float subsurface_scale,
//                           float subsurface_ior,
//                           float subsurface_anisotropy,
//                           float specular_ior_level,
//                           vec4 specular_tint,
//                           float anisotropic,
//                           float anisotropic_rotation,
//                           vec3 T,
//                           float transmission_weight,
//                           float coat_weight,
//                           float coat_roughness,
//                           float coat_ior,
//                           vec4 coat_tint,
//                           vec3 CN,
//                           float sheen_weight,
//                           float sheen_roughness,
//                           vec4 sheen_tint,
//                           vec4 emission,
//                           float emission_strength,
//                           float thin_film_thickness,
//                           float thin_film_ior,
//                           const float do_multiscatter,
//                           out Closure result)
// {
//   /* Match cycles. */
//   metallic = saturate(metallic);
//   roughness = saturate(roughness);
//   ior = max(ior, 1e-5);
//   alpha = saturate(alpha);
//   subsurface_weight = saturate(subsurface_weight);
//   /* Not used by EEVEE */
//   /* subsurface_anisotropy = clamp(subsurface_anisotropy, 0.0, 0.9); */
//   /* subsurface_ior = clamp(subsurface_ior, 1.01, 3.8); */
//   specular_ior_level = max(specular_ior_level, 0.0);
//   specular_tint = max(specular_tint, vec4(0.0));
//   /* Not used by EEVEE */
//   /* anisotropic = saturate(anisotropic); */
//   transmission_weight = saturate(transmission_weight);
//   coat_weight = max(coat_weight, 0.0);
//   coat_roughness = saturate(coat_roughness);
//   coat_ior = max(coat_ior, 1.0);
//   coat_tint = max(coat_tint, vec4(0.0));
//   sheen_weight = max(sheen_weight, 0.0);
//   sheen_roughness = saturate(sheen_roughness);
//   sheen_tint = max(sheen_tint, vec4(0.0));

//   base_color = max(base_color, vec4(0.0));
//   vec4 clamped_base_color = min(base_color, vec4(1.0));

//   N = safe_normalize(N);
//   CN = safe_normalize(CN);
//   vec3 V = coordinate_incoming(g_data.P);
//   float NV = dot(N, V);

//   /* Transparency component. */
//   if (true) {
//     ClosureTransparency transparency_data;
//     transparency_data.weight = weight;
//     transparency_data.transmittance = vec3(1.0 - alpha);
//     transparency_data.holdout = 0.0;
//     closure_eval(transparency_data);

//     weight *= alpha;
//   }

//   /* First layer: Sheen */
//   vec3 sheen_data_color = vec3(0.0);
//   if (sheen_weight > 0.0) {
//     /* TODO: Maybe sheen_weight should be specular. */
//     vec3 sheen_color = sheen_weight * sheen_tint.rgb * principled_sheen(NV, sheen_roughness);
//     sheen_data_color = weight * sheen_color;
//     /* Attenuate lower layers */
//     weight *= max((1.0 - math_reduce_max(sheen_color)), 0.0);
//   }

//   /* Second layer: Coat */
//   if (coat_weight > 0.0) {
//     float coat_NV = dot(CN, V);
//     float reflectance = bsdf_lut(coat_NV, coat_roughness, coat_ior, false).x;

//     ClosureReflection coat_data;
//     coat_data.N = CN;
//     coat_data.roughness = coat_roughness;
//     coat_data.color = vec3(1.0);
//     coat_data.weight = weight * coat_weight * reflectance;
//     closure_eval(coat_data);

//     /* Attenuate lower layers */
//     weight *= max((1.0 - reflectance * coat_weight), 0.0);

//     if (!all(equal(coat_tint.rgb, vec3(1.0)))) {
//       float coat_neta = 1.0 / coat_ior;
//       float NT = sqrt_fast(1.0 - coat_neta * coat_neta * (1 - NV * NV));
//       /* Tint lower layers. */
//       coat_tint.rgb = mix(vec3(1.0), pow(coat_tint.rgb, vec3(1.0 / NT)), saturate(coat_weight));
//     }
//   }
//   else {
//     coat_tint.rgb = vec3(1.0);
//   }

//   /* Emission component.
//    * Attenuated by sheen and coat.
//    */
//   if (true) {
//     ClosureEmission emission_data;
//     emission_data.weight = weight;
//     emission_data.emission = coat_tint.rgb * emission.rgb * emission_strength;
//     closure_eval(emission_data);
//   }

//   /* Metallic component */
//   vec3 reflection_tint = specular_tint.rgb;
//   vec3 reflection_color = vec3(0.0);
//   if (metallic > 0.0) {
//     vec3 F0 = clamped_base_color.rgb;
//     vec3 F82 = min(reflection_tint, vec3(1.0));
//     vec3 metallic_brdf;
//     brdf_f82_tint_lut(F0, F82, NV, roughness, do_multiscatter != 0.0, metallic_brdf);
//     reflection_color = weight * metallic * metallic_brdf;
//     /* Attenuate lower layers */
//     weight *= max((1.0 - metallic), 0.0);
//   }

//   /* Transmission component */
//   if (transmission_weight > 0.0) {
//     vec3 F0 = vec3(F0_from_ior(ior)) * reflection_tint;
//     vec3 F90 = vec3(1.0);
//     vec3 reflectance, transmittance;
//     bsdf_lut(F0,
//              F90,
//              sqrt(clamped_base_color.rgb),
//              NV,
//              roughness,
//              ior,
//              do_multiscatter != 0.0,
//              reflectance,
//              transmittance);

//     reflection_color += weight * transmission_weight * reflectance;

//     ClosureRefraction refraction_data;
//     refraction_data.N = N;
//     refraction_data.roughness = roughness;
//     refraction_data.ior = ior;
//     refraction_data.weight = weight * transmission_weight;
//     refraction_data.color = transmittance * coat_tint.rgb;
//     closure_eval(refraction_data);

//     /* Attenuate lower layers */
//     weight *= max((1.0 - transmission_weight), 0.0);
//   }

//   /* Specular component */
//   if (true) {
//     float eta = ior;
//     float f0 = F0_from_ior(eta);
//     if (specular_ior_level != 0.5) {
//       f0 *= 2.0 * specular_ior_level;
//       eta = ior_from_F0(f0);
//       if (ior < 1.0) {
//         eta = 1.0 / eta;
//       }
//     }

//     vec3 F0 = vec3(f0) * reflection_tint;
//     F0 = clamp(F0, vec3(0.0), vec3(1.0));
//     vec3 F90 = vec3(1.0);
//     vec3 reflectance, unused;
//     bsdf_lut(F0, F90, vec3(0.0), NV, roughness, eta, do_multiscatter != 0.0, reflectance, unused);

//     ClosureReflection reflection_data;
//     reflection_data.N = N;
//     reflection_data.roughness = roughness;
//     reflection_data.color = (reflection_color + weight * reflectance) * coat_tint.rgb;
//     /* `weight` is already applied in `color`. */
//     reflection_data.weight = 1.0f;
//     closure_eval(reflection_data);

//     /* Attenuate lower layers */
//     weight *= max((1.0 - math_reduce_max(reflectance)), 0.0);
//   }

//   /* Subsurface component */
//   if (subsurface_weight > 0.0) {
//     ClosureSubsurface sss_data;
//     sss_data.N = N;
//     sss_data.sss_radius = max(subsurface_radius * subsurface_scale, vec3(0.0));
//     /* Subsurface Scattering materials behave unpredictably with values greater than 1.0 in
//      * Cycles. So it's clamped there and we clamp here for consistency with Cycles. */
//     sss_data.color = (subsurface_weight * weight) * clamped_base_color.rgb * coat_tint.rgb;
//     /* Add energy of the sheen layer until we have proper sheen BSDF. */
//     sss_data.color += sheen_data_color;
//     /* `weight` is already applied in `color`. */
//     sss_data.weight = 1.0f;
//     closure_eval(sss_data);

//     /* Attenuate lower layers */
//     weight *= max((1.0 - subsurface_weight), 0.0);
//   }

//   /* Diffuse component */
//   if (true) {
//     ClosureDiffuse diffuse_data;
//     diffuse_data.N = N;
//     diffuse_data.color = weight * base_color.rgb * coat_tint.rgb;
//     /* Add energy of the sheen layer until we have proper sheen BSDF. */
//     diffuse_data.color += sheen_data_color;
//     /* `weight` is already applied in `color`. */
//     diffuse_data.weight = 1.0f;
//     closure_eval(diffuse_data);
//   }

//   result = Closure(0);
// }
