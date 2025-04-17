import LifeCycleEvents from "./CallbackManager";
import CollisionData from "./collision/CollisionData";
import Entity from "./Entity";
export default class LifeCycle extends Entity {
    onLoad?(): Promise<void>;
    onAwake?(): void;
    start?(): void;

    onPreUpdate?(): void;
    onUpdate?(): void;
    onPostUpdate?(): void;
    onLateUpdate?(): void;

    onPreRender?(): void; 
    onRender?(): void;  
    onPostRender?(): void;
    onDrawGizmos?(): void;  

    constructor(){
        super();
        if(this.onDrawGizmos) {
            LifeCycleEvents.on("drawGizmos", this.onDrawGizmos.bind(this));
        }

        if(this.onUpdate) {
            LifeCycleEvents.on("update", this.onUpdate.bind(this));
        }

        if(this.start) {
            LifeCycleEvents.on("start", this.start.bind(this));
        }
    }
   
    public fixedUpdate(): void{}
    public lateUpdate(): void {}
    public onGUI(): void{}
    public onCollisionEnter(data: CollisionData): void{}
    public onCollisionStay(data: CollisionData): void{}
    public onCollisionExit(data: CollisionData): void{}
}
