import Component from "../../core/components/Component";
import CollisionData from "./CollisionData";


export default class MonoComportament extends Component {
    public awake(): void {}
    public start(): void {}
    public fixedUpdate(): void {}
    public update(): void {}
    public lateUpdate(): void {}
    public onDrawGizmos(): void{}
    public onGUI(): void{}

    public onCollisionEnter(_collisionData: CollisionData): void {}
    public onCollisionStay(_collisionData: CollisionData): void {}

}
