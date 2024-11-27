import Ray from "../physics/Ray";
import Component from "./Component";
import Color from "../math/color";
import Vector3 from "../math/Vector3";

export default class Collider extends Component {
    
    public color: Color = Color.green;
    public raycast(_ray: Ray, _maxDistance: number):  Vector3 | null {return null}
   
}