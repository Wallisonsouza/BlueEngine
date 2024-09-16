precision mediump float;

// Posição da luz no mundo
uniform vec3 u_lightPosition;
// Cor da luz
uniform vec3 u_lightColor;
// Cor do objeto
uniform vec4 u_objectColor;
// Posição da câmera
uniform vec3 u_cameraPosition;
// Intensidade da luz ambiente
const vec3 u_ambientLight = vec3(1.0, 1.0, 1.0);

varying vec3 vNormal;
varying vec3 vWorldPosition;

// Função de reflexão
vec3 reflectionLight(vec3 lightDirection, vec3 normal) {
    return 2.0 * dot(lightDirection, normal) * normal - lightDirection;
}

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
    vec3 reflectDirection = reflectionLight(lightDirection, normal);
    float specular = pow(max(dot(viewDirection, reflectDirection), 0.0), shininess);
    return specularReflection * specularStrength * specular;
}

void main() {
    // Normalização das variáveis
    vec3 normal = normalize(vNormal);
    vec3 lightDirection = normalize(u_lightPosition - vWorldPosition);
    vec3 viewDirection = normalize(u_cameraPosition - vWorldPosition);

    // Parâmetros para o cálculo da iluminação
    float ambientReflection = 0.1; // Refletividade da luz ambiente
    float ambientStrength = 1.0; // Intensidade da luz ambiente

    float diffuseReflection = 1.0; // Refletividade da luz difusa
    float diffuseStrength = 1.0; // Intensidade da luz difusa

    float specularReflection = 1.0; // Refletividade da luz especular
    float specularStrength = 1.0; // Intensidade da luz especular
    float shininess = 32.0; // Brilho especular

    // Cálculo dos fatores de iluminação
    float ambient = ambientFactor(ambientReflection, ambientStrength);
    float diffuse = diffuseFactor(diffuseReflection, diffuseStrength, normal, lightDirection);
    float specular = specularFactor(specularReflection, specularStrength, normal, lightDirection, viewDirection, shininess);

    // Combinação dos componentes de iluminação
    vec3 color = ambient * u_ambientLight + diffuse * u_lightColor + specular * u_lightColor;

    // Definindo a cor final do fragmento
    gl_FragColor = vec4(color * u_objectColor.rgb, u_objectColor.a);
}
