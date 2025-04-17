mat4 createTranslationMatrix(vec3 t) {
    return mat4(
        1.0, 0.0, 0.0, 0.0, 
        0.0, 1.0, 0.0, 0.0, 
        0.0, 0.0, 1.0, 0.0,
        t.x, t.y, t.z, 1.0
    );
}

mat4 createScaleMatrix(vec3 s) {
    return mat4(
        s.x, 0.0, 0.0, 0.0, 
        0.0, s.y, 0.0, 0.0, 
        0.0, 0.0, s.z, 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

mat4 createRotationMatrix(vec4 r) {
    float xx = r.x * 2.0;
    float yy = r.y * 2.0;
    float zz = r.z * 2.0;
    float x_xx = r.x * xx;
    float y_yy = r.y * yy;
    float z_zz = r.z * zz;
    float x_yy = r.x * yy;
    float x_zz = r.x * zz;
    float y_zz = r.y * zz;
    float w_xx = r.w * xx;
    float w_yy = r.w * yy;
    float w_zz = r.w * zz;

    return mat4(
        1.0 - (y_yy + z_zz), x_yy + w_zz, x_zz - w_yy, 0.0,
        x_yy - w_zz, 1.0 - (x_xx + z_zz), y_zz + w_xx, 0.0,
        x_zz + w_yy, y_zz - w_xx, 1.0 - (x_xx + y_yy), 0.0,
        0.0, 0.0, 0.0, 1.0
    );
}

mat4 createCompose(vec3 t,vec4 r, vec3 s) {
    float xx = r.x * 2.0;
    float yy = r.y * 2.0;
    float zz = r.z * 2.0;
    float x_xx = r.x * xx;
    float y_yy = r.y * yy;
    float z_zz = r.z * zz;
    float x_yy = r.x * yy;
    float x_zz = r.x * zz;
    float y_zz = r.y * zz;
    float w_xx = r.w * xx;
    float w_yy = r.w * yy;
    float w_zz = r.w * zz;

    return mat4(
        s.x * (1.0 - (y_yy + z_zz)), s.x * (x_yy + w_zz), s.x * (x_zz - w_yy), 0.0,
        s.y * (x_yy - w_zz), s.y * (1.0 - (x_xx + z_zz)), s.y * (y_zz + w_xx), 0.0,
        s.z * (x_zz + w_yy), s.z * (y_zz - w_xx), s.z * (1.0 - (x_xx + y_yy)), 0.0,
        t.x, t.y, t.z, 1.0
    );
}

vec3 fog(vec3 fragPos, vec3 cameraPosition, float fogDensity, vec3 fogColor, vec3 objectColor) {
    // Calcula a distância entre o fragmento e a câmera
    float distance = length(fragPos - cameraPosition);

    // Calcula o fator de névoa usando a densidade e a distância ao quadrado
    float fogFactor = 1.0 - exp(-fogDensity * distance * distance);

    // Limita o fator de névoa entre 0 e 1
    fogFactor = clamp(fogFactor, 0.0, 1.0); 

    // Cor final do fragmento
    vec3 finalColor = mix(objectColor, fogColor, fogFactor);

    return finalColor;
}

float trowbridgeReitzAnisotropicNDF(float NdotH, float roughness, float anisotropy, float HdotT, float HdotB)
{
    float aspect = sqrt(1.0 - 0.9 * anisotropy);
    float alpha = roughness * roughness;

    float roughT = alpha / aspect;
    float roughB = alpha * aspect;

    float alpha2 = alpha * alpha;
    float NdotH2 = NdotH * NdotH;
    float HdotT2 = HdotT * HdotT;
    float HdotB2 = HdotB * HdotB;

    float denominator = PI * roughT * roughB * pow(HdotT2 / (roughT * roughT) + HdotB2 / (roughB * roughB) + NdotH2, 2.0);
    return 1.0 / denominator;
}