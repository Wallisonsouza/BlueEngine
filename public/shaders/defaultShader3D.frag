precision highp float;
// // Posição da luz no mundo
// Cor da luz
const vec3 u_lightColor = vec3(1.0);
const vec3 u_ambientLightColor = vec3(1.0);
// Cor do objeto

// Posição da câmera
uniform vec3 CAMERA_POSITION;
uniform vec3 CAMERA_DIRECTION;
uniform vec3 OBJECT_COLOR;


varying vec3 vNormal;
varying vec3 vWorldPosition;
const float SPECULAR = 1.0;

uniform sampler2D TEXTURE_ALBEDO;
varying vec2 vTextureCoord;

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

const float specularStrength = 1.0;
const float shininess = 32.0;
const float diffuseStrength = 1.0;

void main() {
    vec3 normal = normalize(vNormal);
    vec3 lightDirection = normalize(CAMERA_POSITION - vWorldPosition);
    vec3 viewDirection = CAMERA_DIRECTION;

    // Parâmetros de iluminação
    float ambientReflection = 0.1;
    float ambientStrength = 0.1;
    float diffuseReflection = 0.7;
    

    float ambient = ambientFactor(ambientReflection, ambientStrength);
    float specular = specularFactor(SPECULAR, specularStrength, normal, lightDirection, viewDirection, shininess);
    float diffuse = diffuseFactor(diffuseReflection, diffuseStrength, normal, lightDirection);

    vec3 ambientLight = u_ambientLightColor * ambient;
    vec3 diffuseLight = u_lightColor * diffuse;
    vec3 specularLight = u_lightColor * specular;

    vec3 finalColor = (ambientLight + diffuseLight + specularLight) * OBJECT_COLOR;
    vec4 texture = texture2D(TEXTURE_ALBEDO, vTextureCoord);
    gl_FragColor = vec4(finalColor * texture.rgb, texture.a);
}
