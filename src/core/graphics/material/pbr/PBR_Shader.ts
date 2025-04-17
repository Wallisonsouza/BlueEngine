import WorldOptions from "../../../../../engine/WorldOptions";
import Camera from "../../../components/Camera";
import AmbientLight from "../../../components/light/AmbientLight";
import DirecionalLight from "../../../components/light/DirecionalLight";
import LightManager from "../../../components/light/LightManager";
import BufferHelper from "../../../managers/BufferHelper";
import Shader from "../../shaders/Shader";


export class PBRShader extends Shader {

    public override onPreRender(): void {
        this.use();
        const camera = Camera.main;
        this.setVec3("u_viewPosition", camera.transform.position);
        this.applyLight();
        this.setInt("u_renderPass", WorldOptions.renderPass);


        const buffer = BufferHelper.getUniformBuffer(camera.id.value);
        BufferHelper.updateCameraBuffer(camera);
        if(buffer) {
            this.setUniformBuffer(buffer, "CameraUniform", 0);
        }
    }

    private applyLight(): void {
        if (!this) return;
    
        const lights = LightManager.getLights();
        const maxLights = 10;
        const lightCount = Math.min(lights.length, maxLights);
    
        for (let index = 0; index < lightCount; index++) {
            const light = lights[index];
    
            this.setVec3(`u_lights[${index}].color`, light.color.rgb);
            this.setFloat(`u_lights[${index}].intensity`, light.intensity);
    
            if (light.type === AmbientLight.STRING_NAME) {
                this.setInt(`u_lights[${index}].type`, 0);

            } else if (light.type === DirecionalLight.TYPE) {
                this.setInt(`u_lights[${index}].type`, 1);
                this.setVec3(`u_lights[${index}].position`, light.transform.position.xyz);
                this.setVec3(`u_lights[${index}].direction`, light.transform.forward.xyz);
               
            }
        }
    
        this.setInt("u_lightCount", lightCount);
    }

}