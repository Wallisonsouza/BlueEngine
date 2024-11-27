#define PI 3.1415926535897932384626433832795
#define EPSILON 1e-5

precision highp float;
const float specular_ior_level = 0.5;
uniform vec3 u_camera_direction;
uniform vec3 u_camera_position;
uniform vec3 u_lightDir; 
uniform float u_time;
varying vec3 vWorldPosition;


varying vec2 vTextureCoord;
varying vec3 v_normal;
varying vec3 v_tangent;
varying vec3 v_fragment_position;
varying vec3 v_bitangent;

varying float v_height;




struct Light {
    vec3 position;
    vec3 color;
    float angle;
    float intensity;
    vec3 radiance;
    float radius;
    vec3 direction;
};

struct Material {
    vec3 baseColor;
    float metallic;
    float roughness;
    float alpha;
    float ior;
};

struct Texture {
    sampler2D baseColor;
    sampler2D metallicRoughness;
    sampler2D environment;
    sampler2D normal;

    bool hasBaseColor;
    bool hasMetallicRoughness;
    bool hasEnvironment;
    bool hasNormal;
};

uniform Material u_material;
uniform Texture u_texture;


const int MAX_LIGHTS = 10;
uniform Light u_lights[10]; 





float linear_rgb_to_srgb(float color)
{
  if (color < 0.0031308) {
    return (color < 0.0) ? 0.0 : color * 12.92;
  }

  return 1.055 * pow(color, 1.0 / 2.4) - 0.055;
}

vec3 linear_rgb_to_srgb(vec3 color)
{
  return vec3(
      linear_rgb_to_srgb(color.r), 
      linear_rgb_to_srgb(color.g), 
      linear_rgb_to_srgb(color.b)
    );
}

vec2 spherical_mapping(vec3 normal) {
    float phi = atan(normal.z, normal.x);  // Ângulo azimutal (em torno do eixo Y)
    float theta = acos(normal.y);           // Ângulo polar (em relação ao eixo Y)

    // Normaliza para coordenadas UV
    float u = (phi + PI) / (2.0 * PI);  // Mapeia -pi..pi para 0..1
    float v = theta / PI;                    // Mapeia 0..pi para 0..1

    return vec2(u, v);
}

float pow_5(float value) {
    return value * value * value * value * value;
}

vec3 schlick_fresnel_approximation(vec3 F0, float cosTheta) {
    cosTheta = clamp(cosTheta, 0.0, 1.0);
    return F0 + (1.0 - F0) * pow_5(1.0 - cosTheta);
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


float gaSchlickG1(float cosTheta, float k)
{
	return cosTheta / (cosTheta * (1.0 - k) + k);
}


float G_GGX(float cosLi, float cosLo, float roughness)
{
	float r = roughness + 1.0;
	float k = (r * r) / 8.0;
	return gaSchlickG1(cosLi, k) * gaSchlickG1(cosLo, k);
}


float D_GGX(in float NdH, in float roughness)
{
    float a = roughness * roughness; // α²
    float a2 = a * a;                // α⁴
    float NdH2 = NdH * NdH;          // (N · H)²

    float denom = NdH2 * (a2 - 1.0) + 1.0; // denom = cos²(θ_h) * (α² - 1) + 1
    return a2 / (PI * denom * denom);
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

float saturate(float x) {
    return clamp(x, EPSILON, 1.0);
}

vec3 saturate(vec3 v) {
    return vec3(
        saturate(v.x),
        saturate(v.y),
        saturate(v.z)
    );
}

vec3 safe_normalize(vec3 v) {
    float len = length(v); 
    return len > 0.0 ? v / len : vec3(0.0);
}

vec3 BRDF(
    vec3 V,
    vec3 N,
    vec3 L,
    Material material,
    Light light
) {
    N = safe_normalize(N);
    V = safe_normalize(V);
    L = safe_normalize(L);

    material.metallic = saturate(material.metallic);
    material.roughness = saturate(material.roughness);
    material.alpha = saturate(material.alpha);
    material.ior = max(material.ior, 1e-5);
    material.baseColor = saturate(material.baseColor);


    float eta = material.ior;
    float f0 = F0_from_ior(eta);

    if (specular_ior_level != 0.5) {
        f0 *= 2.0 * specular_ior_level;
        eta = ior_from_F0(f0);
        if (material.ior < 1.0) {
            eta = 1.0 / eta;
        }
    }

    // F0 básico com a contribuição de IOR
    vec3 baseF0 = vec3(f0);

    // Mistura F0 com base_color de acordo com metallic
    vec3 F0 = mix(baseF0, material.baseColor, material.metallic);
    F0 = clamp(F0, vec3(0.0), vec3(1.0));

    // Ângulos relevantes
 
    float NdotL = max(0.0, dot(N, L));

    if (NdotL > 0.0) {

        float NdotV = max(0.0, dot(N, V));
        vec3 H = normalize(L + V);
        float NdotH = max(0.0, dot(N, H));
        float HdotV = max(0.0, dot(H, V));
        
        vec3 F = schlick_fresnel_approximation(F0, HdotV);
        float D = D_GGX(NdotH, material.roughness);
        float G = G_GGX(NdotL, NdotV, material.roughness);

        vec3 kd = mix(vec3(1.0) - F, vec3(0.0), material.metallic);
        vec3 diffuseBRDF = kd * Diffuse_OrenNayar(material.baseColor, L, V, N, material.roughness);
        vec3 specularBRDF = (F * D * G) / max(1e-4, 4.0 * NdotL * NdotV);

        return (specularBRDF + diffuseBRDF) * NdotL;
    }

    return vec3(0.0);
}

void main()
{
    vec3 surface_normal = normalize(v_normal);
 

    Material material = u_material;

    if(u_texture.hasBaseColor) {
	    vec4 baseColorTexture = texture2D(u_texture.baseColor, vTextureCoord);
        material.baseColor = baseColorTexture.rgb;
        material.alpha *= baseColorTexture.a;
    }

    if (u_texture.hasNormal) {

         mat3 TBN = mat3(
            normalize(v_tangent),
            normalize(v_bitangent),
            normalize(v_normal)
        );

        vec3 normalTangentSpace = normalize(2.0 * texture2D(u_texture.normal, vTextureCoord).rgb - 1.0);
        surface_normal = normalize(TBN * normalTangentSpace); // Transforma para o espaço desejado
    }

    if (u_texture.hasMetallicRoughness) {
        vec3 mr = texture2D(u_texture.metallicRoughness, vTextureCoord).rgb;
        
        material.roughness = mr.g;
        material.metallic = mr.b;
    }

	// Outgoing light direction (vector from world-space fragment position to the "eye").
	vec3 view_direction = normalize(u_camera_position - v_fragment_position);

	// Direct lighting calculation for analytical lights.
	vec3 directLighting = vec3(0);
	for(int i = 0; i < 1; i++) {

        Light light = u_lights[i];

		// Total contribution for this light.
		directLighting += BRDF(
            view_direction, 
            surface_normal, 
            -light.direction,
            material, 
            light
        );
        
	}

    gl_FragColor =  vec4(directLighting, material.alpha);
}
