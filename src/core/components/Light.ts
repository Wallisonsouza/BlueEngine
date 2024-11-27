
import Gizmos from "../factory/Gizmos";
import Color from "../math/color";
import Component from "./Component";

export enum LightType {
    Directional,
    Point,
    Spot
}

export default class Light extends Component {
    public lightType: LightType;
    public color: Color;
    public intensity: number;
    public radius: number;           // Para luzes pontuais
    public innerConeAngle: number;   // Para luzes spot
    public outerConeAngle: number;   // Para luzes spot

    private static _allLights: Light[] = [];

    public static addLight(light: Light) {
        if(!this._allLights?.includes(light)) {
            this._allLights.push(light);
        }
    }

    public static getAllLights() {
        return this._allLights;
    }


    constructor(
        lightType: LightType = LightType.Directional,
        color: Color = Color.white,
        intensity: number = 1.0,
        radius: number = 10.0,
        innerConeAngle: number = Math.PI / 8,
        outerConeAngle: number = Math.PI / 4
    ) {
        super();
        this.lightType = lightType;
        this.color = color;
        this.intensity = intensity;
        this.radius = radius;
        this.innerConeAngle = innerConeAngle;
        this.outerConeAngle = outerConeAngle;


        
        // this.transform.rotation = Quaternion.fromEulerAngles(new Vector3(-45, 45, 0));
    }
  
    public drawGizmos(): void {
        Gizmos.drawWireSphere(this.transform.position, 1.0)
    }
    
}

// export default class DirectionalLight extends Light  {
//     public color: Color = Color.white;
//     public intensity: number;
//     public range: number;
//     public direction: Vector3;
//     private lightProjectionMatrix: Matrix4x4;
//     private lightViewMatrix: Matrix4x4;

//     constructor(gameObject: GameObject | null = null, direction: Vector3 = new Vector3(0, -1, 0)) {
//         super("DirectionalLight");
//         this.range = 1000; // Limite da projeção ortográfica
//         this.intensity = 1;
//         this.direction = direction;
//         this.lightProjectionMatrix = Matrix4x4.identity();
//         this.lightViewMatrix = Matrix4x4.identity();

//         if (gameObject) {
//             this.setGameObject(gameObject);
//         }

//         this.updateMatrices();
//     }

//     private updateMatrices(): void {
//         // Configuração de projeção ortográfica para o shadow map
//         const left = -this.range;
//         const right = this.range;
//         const bottom = -this.range;
//         const top = this.range;
//         const near = 0.1;
//         const far = this.range * 2;

//         this.lightProjectionMatrix = Matrix4x4.orthographic(left, right, bottom, top, near, far);

//         const lightPosition = this.gameObject?.transform.position || new Vector3(0, 0, 0);
//         const target = lightPosition.add(this.direction);
//         const up = new Vector3(0, 1, 0);

//         this.lightViewMatrix = Matrix4x4.lookAt(lightPosition, target, up);
//     }

//     public getProjectionMatrix(): Matrix4x4 {
//         return this.lightProjectionMatrix;
//     }

//     public getViewMatrix(): Matrix4x4 {
//         return this.lightViewMatrix;
//     }

//     public setDirection(direction: Vector3): void {
//         this.direction = direction;
//         this.updateMatrices();
//     }
// }
