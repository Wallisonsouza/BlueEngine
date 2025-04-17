import Color from "../../math/color";
import Component from "../Component";

export default class Light extends Component {
    
    public color: Color;
    public intensity: number;

 
    constructor(
        type: string = "Light",
        color: Color = Color.WHITE,
        intensity: number = 1.0,
       
    ) {
        super(type,"Light");
        this.color = color;
        this.intensity = intensity;
       
    }
}
