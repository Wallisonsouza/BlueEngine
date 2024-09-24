precision highp float;

// Cor da luz
const vec3 u_lightColor = vec3(1.0);
const vec3 u_ambientLightColor = vec3(1.0);

// Cor do objeto
uniform vec3 OBJECT_COLOR;
// Posição da câmera
uniform vec3 CAMERA_DIRECTION;
// Posição da luz no mundo
uniform vec3 LIGHT_POSITION;

uniform sampler2D TEXTURE_ALBEDO;
varying vec2 vTextureCoord;

varying vec3 vNormal;
varying vec3 vWorldPosition;

uniform float MATERIAL_SPECULAR;
uniform bool isTexture;

// Constantes de atenuação
const float constantAttenuation = 1.0;
const float linearAttenuation = 0.09;
const float quadraticAttenuation = 0.032;
uniform float LIGHT_RANGE;
uniform float LIGHT_INTENSITY;


// Fator de luz ambiente
float ambientFactor(float ambientReflection, float ambientStrength) {
    return ambientStrength * ambientReflection; 
}

// Fator de luz difusa
float diffuseFactor(float diffuseReflection, float diffuseStrength, vec3 normal, vec3 lightDirection) {
    float diffuse = max(dot(normal, lightDirection), 0.0);
    return diffuseReflection * diffuseStrength * diffuse;
}

// Fator de luz especular
float specularFactor(float specularReflection, float specularStrength, vec3 normal, vec3 lightDirection, vec3 viewDirection, float shininess) {
    vec3 reflectDirection = reflect(-lightDirection, normal);
    float specular = pow(max(dot(viewDirection, reflectDirection), 0.0), shininess);
    return specularReflection * specularStrength * specular;
}

float attenuation(float distance) {
    if (distance > LIGHT_RANGE) {
        return 0.0; 
    }
    float att = 1.0 / (constantAttenuation + linearAttenuation * distance + quadraticAttenuation * distance * distance);
    return att;
}

void main() {
    vec3 normal = normalize(vNormal);
    
    // Cálculo da direção da luz e da distância
    vec3 lightDirection = normalize(LIGHT_POSITION - vWorldPosition);
    float distance = length(LIGHT_POSITION - vWorldPosition);
     float att = attenuation(distance);
    // Cálculo da atenuação
    
    vec3 viewDirection = normalize(CAMERA_DIRECTION - vWorldPosition);

    // Parâmetros de iluminação
    float ambientReflection = 0.1;
    float ambientStrength = 0.1;
    float diffuseReflection = 0.7;
    const float specularStrength = 1.0;
    const float shininess = 32.0;
    const float diffuseStrength = 1.0;

    float ambient = ambientFactor(ambientReflection, ambientStrength);
    float diffuse = diffuseFactor(diffuseReflection, diffuseStrength, normal, lightDirection);
    float specular = specularFactor(MATERIAL_SPECULAR, specularStrength, normal, lightDirection, viewDirection, shininess);

    vec3 ambientLight = u_ambientLightColor * ambient;
     vec3 diffuseLight = u_lightColor * diffuse * att * LIGHT_INTENSITY; 
    vec3 specularLight = u_lightColor * specular * att * LIGHT_INTENSITY;

   
    vec3 finalColor = (ambientLight + diffuseLight + specularLight) * OBJECT_COLOR;
    
    if(isTexture) {
        vec4 texture = texture2D(TEXTURE_ALBEDO, vTextureCoord);
        gl_FragColor = vec4(texture.rgb * finalColor, texture.a);
    } else {
        gl_FragColor = vec4(finalColor, 1.0);
    }
}
