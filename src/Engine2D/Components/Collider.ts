import Ray from "../../Base/Mathf/Ray";
import Vector3 from "../../../engine_modules/vectors/Vector3";
import Component from "../../components/Component";
import Color from "../../Engine/static/color";

export default class Collider extends Component {
    
    public color: Color = Color.green;
    public raycast(_ray: Ray, _maxDistance: number):  Vector3 | null {return null}
}