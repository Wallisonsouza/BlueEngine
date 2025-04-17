import ShaderManager from "../../../managers/ShaderManager";
import Material from "../Material";
import Vector3 from "../../../math/Vector3";
import Texture from "../Texture";
import LoadResources from "../../../managers/LoadResources";
import Camera from "../../../components/Camera";
import Light from "../../../components/light/Light";
import WorldOptions from "../../../../../engine/WorldOptions";
import { TextureType } from "../../../enum/TextureType";
import Display from "../../../components/Display";
import DirecionalLight from "../../../components/light/DirecionalLight";
import AmbientLight from "../../../components/light/AmbientLight";
import BufferManager from "../../../managers/BufferManager";
import { NullReferenceException } from "../../../Error";
import LightManager from "../../../components/light/LightManager";


export default class PBRMaterial extends Material {
    
    private _metallic: number = 0.2;
    private _roughness: number = 0.4;
    private _ior: number = 1.5;
    private _emissive: Vector3 = Vector3.zero;
    
    public emissiveTexture: Texture | null = null;
    public ambientOcclusion: Texture | null = null;
    public baseColorTexture: Texture | null = null;
    public normalTexture: Texture | null = null;
    public metallicRoughnessTexture: Texture | null = null;
    public lutTexture: Texture | null = null;
    
    public get metallic() {
        return this._metallic;
    }
    public get roughness() {
        return this._roughness;
    }
    public get ior() {
        return this._ior;
    }
    public get emissive() {
        
        return this._emissive;
    }

    public set metallic(value: number) {
        if (this._metallic !== value) {
            this._metallic = value;
            this.uniformBlock.setFloat("metallic", value);
        }
    }
    
    public set roughness(value: number) {
        if (this._roughness !== value) {
            this._roughness = value;
            this.uniformBlock.setFloat("roughness", value);
        }
    }
    
    public set ior(value: number) {
        if (this._ior !== value) {
            this._ior = value;
            this.uniformBlock.setFloat("ior", value);
        }
    }
    
    public set emissive(value: Vector3) {
        if (!this._emissive.equals(value)) {
            this._emissive = value;
            this.uniformBlock.setVec3("emisive", value.toFloat32Array());
        }
    }
   
    constructor() {
       
        const shader = ShaderManager.getShader("3d");

        if(! shader) {
            throw new NullReferenceException("[PBRMaterial]", "Shader principal não encontrado.");
        }

        super("PBRMaterial", shader);

        this.uniformBlock.defineFloat("metallic", this.metallic);
        this.uniformBlock.defineFloat("roughness", this.roughness);
        this.uniformBlock.defineFloat("ior", this.ior);
        this.uniformBlock.defineVec3("emissive", this.emissive.toFloat32Array());
        this.uniformBlock.createBuffer(this.id.value);

        
        this.start();
     
        Display.applyResolution();

    }

    flag = 0;

    public start() {

        if(!this.shader) {return};
        this.shader.setGlobalUniforms = () => {
            this.shader.use();
            const camera = Camera.main;
            this.shader.setVec3("u_viewPosition", camera.transform.position);
            this.applyLight();
            this.shader.setInt("u_renderPass", WorldOptions.renderPass);


            const buffer = BufferManager.getUniformBuffer(camera.id.value);
            BufferManager.updateCameraBuffer(camera);
            if(buffer) {
                this.shader.setUniformBuffer(buffer, "CameraUniform", 0);
            }


           
            
            // this.shader.setMat4("u_view", camera.viewMatrix);
            // this.shader.setMat4("u_projection", camera.projectionMatrix);

            // this.flag |= TextureType.ENVIRONMENT;
            // this.shader.setInt("u_textureFlags", this.flag);
            // this.shader.setSampleCube("u_skyBox", WorldOptions.environmentTexture, 6);
        };
    }

    public setAmbientOcclusionTexture(imageUrl: string): void {
        LoadResources.loadTexture(imageUrl).then(texture => {
            this.ambientOcclusion = texture;
        });
    }

    public setMetallicRoughnessTexture(imageUrl: string): void {
        LoadResources.loadTexture(imageUrl).then(texture => {
            this.metallicRoughnessTexture = texture;
        });
    }

    public setEmissiveTexture(imageUrl: string): void {
        LoadResources.loadTexture(imageUrl).then(texture => {
            this.emissiveTexture = texture;
        });
    }

    public setBaseColorTexture(imageUrl: string): void {
        LoadResources.loadTexture(imageUrl).then(texture => {
            this.baseColorTexture = texture;
        });
    }

    public setNormalTexture(imageUrl: string): void {
        LoadResources.loadTexture(imageUrl).then(texture => {
            this.normalTexture = texture;
        });
    }

    private applyTextures(): void {
       
        if(this.shader) {

            if (this.baseColorTexture?.webGLTexture) {
                this.flag |= TextureType.BASE_COLOR;
                this.shader.setSample2d("u_baseColorTexture", this.baseColorTexture.webGLTexture, 0);
            }

            if (this.normalTexture?.webGLTexture) {
                this.flag |= TextureType.NORMAL;
                this.shader.setSample2d("u_normalTexture", this.normalTexture.webGLTexture, 1);
            }
            if (this.metallicRoughnessTexture?.webGLTexture) {
                this.flag |= TextureType.METALLIC_ROUGHNESS;
                this.shader.setSample2d("u_metallicRoughnessTexture", this.metallicRoughnessTexture.webGLTexture, 2);
            }
            if (this.emissiveTexture?.webGLTexture) {
                this.flag |= TextureType.EMISSIVE;
                this.shader.setSample2d("u_emissiveTexture", this.emissiveTexture.webGLTexture, 3);
            }

            // if(this.lutTexture?.webGLTexture) {
            //     this.flag |= TextureType.LUT;
            //     this.shader.setSample2d("u_lut", this.lutTexture.webGLTexture, 4);
            // }

            this.shader.setInt("u_textureFlags", this.flag);
            this.flag = 0;
        }
    }

    private applyLight(): void {
        if (!this.shader) return;
    
        const lights = LightManager.getLights();
        const maxLights = 10;
        const lightCount = Math.min(lights.length, maxLights);
    
        for (let index = 0; index < lightCount; index++) {
            const light = lights[index];
    
            this.shader.setVec3(`u_lights[${index}].color`, light.color.rgb);
            this.shader.setFloat(`u_lights[${index}].intensity`, light.intensity);
    
            if (light.type === AmbientLight.STRING_NAME) {
                this.shader.setInt(`u_lights[${index}].type`, 0);

            } else if (light.type === DirecionalLight.TYPE) {
                this.shader.setInt(`u_lights[${index}].type`, 1);
                this.shader.setVec3(`u_lights[${index}].position`, light.transform.position.xyz);
                this.shader.setVec3(`u_lights[${index}].direction`, light.transform.forward.xyz);
               
            }
        }
    
        this.shader.setInt("u_lightCount", lightCount);
    }

    private applyMaterialProperties(): void {
        const buffer = BufferManager.getUniformBuffer(this.id.value);
        if(buffer) {
            this.shader.setUniformBuffer(buffer, "MaterialUniform", 1);
        }
        this.shader.setVec3("u_emissiveFactor", this._emissive);
    }
    
    public apply(): void {

        if(!this.shader) return;
        this.shader.use();
        this.applyTextures();
        this.applyMaterialProperties();
    }

}