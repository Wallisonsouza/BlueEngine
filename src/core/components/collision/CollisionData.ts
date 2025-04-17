import Vector3 from "../../math/Vector3";
import GameObject from "../GameObject";

export default class CollisionData {
    public gameObject: GameObject;
    public otherGameObject: GameObject;
    public contactPoint?: Vector3;
    
    constructor(
        gameObject: GameObject,
        otherObject: GameObject,
        contactPoints?: Vector3,
       
    ) {
        this.gameObject = gameObject;
        this.otherGameObject = otherObject;
        this.contactPoint = contactPoints;
    }
}