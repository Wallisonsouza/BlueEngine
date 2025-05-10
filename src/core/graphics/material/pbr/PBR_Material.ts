import ShaderManager from "../../../managers/ShaderManager";
import Material from "../Material";
import Vector3 from "../../../math/Vector3";
import Texture from "../Texture";
import LoadResources from "../../../managers/LoadResources";
import Camera from "../../../components/Camera";
import WorldOptions from "../../../../../engine/WorldOptions";
import { TextureType } from "../../../enum/TextureType";
import Display from "../../../components/Display";
import DirecionalLight from "../../../components/light/DirecionalLight";
import AmbientLight from "../../../components/light/AmbientLight";
import BufferManager from "../../../managers/BufferManager";
import { NullReferenceException } from "../../../Error";
import LightManager from "../../../components/light/LightManager";
import State from "../../../State";
import UniformBlock from "../../../managers/UniformBlock";
import ShadowFrameBuffer from "../../../ShadowTarget";


function uniformFloatState(initial: number, uniformBlock: UniformBlock, name: string): State<number> {
    return new State(
        initial,
        (v) => uniformBlock.setFloat(name, v),
        (a, b) => a !== b
    );
}

function uniformVec3State(initial: Vector3, uniformBlock: UniformBlock, name: string): State<Vector3> {
    return new State(
        initial,
        (v) => uniformBlock.setVec3(name, v.toFloat32Array()),
        (a, b) => !a.equals(b)
    );
}

export default class PBRMaterial extends Material {

    public baseColorTexture: Texture | null = null;
    public normalTexture: Texture | null = null;
    public metallicRoughnessTexture: Texture | null = null;
    public emissiveTexture: Texture | null = null;
    public ambientOcclusion: Texture | null = null;
    public lutTexture: Texture | null = null;

    private metallicState: State<number> = uniformFloatState(0.2, this.uniformBlock, "metallic");
    private roughnessState: State<number> = uniformFloatState(0.4, this.uniformBlock, "roughness");
    private iorState: State<number> = uniformFloatState(1.5, this.uniformBlock, "ior");
    private emissiveState: State<Vector3> = uniformVec3State(new Vector3(0, 0, 0), this.uniformBlock, "emissive");
    private flag = 0;

    constructor() {
        const shader = ShaderManager.getShader("3d");
        if (!shader) {
            throw new NullReferenceException("[PBRMaterial]", "Shader principal não encontrado.");
        }

        super("PBRMaterial", shader);

        this.uniformBlock.defineFloat("metallic", this.metallic);
        this.uniformBlock.defineFloat("roughness", this.roughness);
        this.uniformBlock.defineFloat("ior", this.ior);
        this.uniformBlock.defineVec3("emissive", this.emissive.toFloat32Array());
        this.uniformBlock.createBuffer(this.id.value);

        this.initializeShaderUniforms();
        Display.applyResolution();
    }

    // === Getters e Setters ===

    public get metallic() { return this.metallicState.get(); }
    public set metallic(value: number) { this.metallicState.set(value); }

    public get roughness() { return this.roughnessState.get(); }
    public set roughness(value: number) { this.roughnessState.set(value); }

    public get ior() { return this.iorState.get(); }
    public set ior(value: number) { this.iorState.set(value); }

    public get emissive(): Vector3 { return this.emissiveState.get(); }
    public set emissive(value: Vector3) { this.emissiveState.set(value); }

    // === Métodos Públicos ===

    public apply(): void {
        if (!this.shader) return;
        this.shader.use();
        this.applyTextures();
        this.applyMaterialProperties();
    }

    public setBaseColorTexture(url: string) {
        this.loadTexture(url, (t) => this.baseColorTexture = t);
    }

    public setNormalTexture(url: string) {
        this.loadTexture(url, (t) => this.normalTexture = t);
    }

    public setMetallicRoughnessTexture(url: string) {
        this.loadTexture(url, (t) => this.metallicRoughnessTexture = t);
    }

    public setEmissiveTexture(url: string) {
        this.loadTexture(url, (t) => this.emissiveTexture = t);
    }

    public setAmbientOcclusionTexture(url: string) {
        this.loadTexture(url, (t) => this.ambientOcclusion = t);
    }

    // === Métodos Privados ===

    private loadTexture(url: string, assign: (t: Texture) => void) {
        LoadResources.loadTexture(url).then(assign);
    }

    private initializeShaderUniforms(): void {
        if (!this.shader) return;

        this.shader.setGlobalUniforms = () => {
            this.shader!.use();

            const camera = Camera.main;
            this.shader!.setVec3("u_viewPosition", camera.transform.position);
            this.shader!.setInt("u_renderPass", WorldOptions.renderPass);

            this.applyLight();

            const cameraBuffer = BufferManager.getUniformBuffer(camera.id.value);
            BufferManager.updateCameraBuffer(camera);

            if (cameraBuffer) {
                this.shader!.setUniformBuffer(cameraBuffer, "CameraUniform", 0);
            }
        };
    }

    private applyTextures(): void {
        if (!this.shader) return;

        const { shader } = this;

        if (this.baseColorTexture?.webGLTexture) {
            this.flag |= TextureType.BASE_COLOR;
            shader.setSample2d("u_baseColorTexture", this.baseColorTexture.webGLTexture, 0);
            shader.unbindSampler2d(0);
        
        }

        if (this.normalTexture?.webGLTexture) {
            this.flag |= TextureType.NORMAL;
            shader.setSample2d("u_normalTexture", this.normalTexture.webGLTexture, 1);
        }

        if (this.metallicRoughnessTexture?.webGLTexture) {
            this.flag |= TextureType.METALLIC_ROUGHNESS;
            shader.setSample2d("u_metallicRoughnessTexture", this.metallicRoughnessTexture.webGLTexture, 2);
        }

        if (this.emissiveTexture?.webGLTexture) {
            this.flag |= TextureType.EMISSIVE;
            shader.setSample2d("u_emissiveTexture", this.emissiveTexture.webGLTexture, 3);
        }

        shader.setSample2d("u_shadowMap", ShadowFrameBuffer.depthTexture, 4);

        shader.setInt("u_textureFlags", this.flag);
        this.flag = 0;
    }

    private applyMaterialProperties(): void {
        const buffer = BufferManager.getUniformBuffer(this.id.value);
        if (buffer) {
            this.shader!.setUniformBuffer(buffer, "MaterialUniform", 1);
        }

        this.shader!.setVec3("u_emissiveFactor", this.emissive);
    }

    private applyLight(): void {
        if (!this.shader) return;

        const lights = LightManager.getLights();
        const maxLights = 10;
        const count = Math.min(lights.length, maxLights);

        for (let i = 0; i < count; i++) {
            const light = lights[i];

            this.shader.setVec3(`u_lights[${i}].color`, light.color.rgb);
            this.shader.setFloat(`u_lights[${i}].intensity`, light.intensity);

            if (light.type === AmbientLight.STRING_NAME) {
                this.shader.setInt(`u_lights[${i}].type`, 0);
            } else if (light.type === DirecionalLight.TYPE) {
                this.shader.setInt(`u_lights[${i}].type`, 1);
                this.shader.setVec3(`u_lights[${i}].position`, light.transform.position.xyz);
                this.shader.setVec3(`u_lights[${i}].direction`, light.transform.fwd.xyz);
            }
        }

        this.shader.setInt("u_lightCount", count);
    }
}
