import Time from "../Time";
import BoxCollider from "../components/BoxCollider";
import CollisionData from "../components/CollisionData";
import Component from "../components/Component";
import GameObject from "../components/GameObject";
import Rigidbody from "../components/RigidBody";
import Vector3 from "../math/Vector3";
import ScryptManager from "./ScryptManager";

export default class PhysicsManager {

    public static fixedUpdate() {

        const scrypts = ScryptManager.getScrypts();
        const gameObjects = GameObject.getAllGameObjects();

        // apos obter todos os objetos percorro todos eles
        gameObjects.forEach(entity => {

            if (!entity.activeSelf) return;

            const components = entity.getComponents(Component);
            const rigidBody = entity.getComponent(Rigidbody);
            rigidBody?.update(Time.fixedDeltaTime);

            components.forEach(component => {

                if(!component.active) return;

                if(component.type === "BoxCollider") {
                    const colliderA = component as BoxCollider;
                    gameObjects.forEach(otherEntity => {
                        if (entity === otherEntity) return; 
            
                        const colliderB = otherEntity.getComponent(BoxCollider);
                        if (colliderB && colliderA.isCollidingWith(colliderB)) {

                          
                            const contactPoinst: Vector3[] = [];
                            const collisionData = new CollisionData( entity, otherEntity, contactPoinst);
                            scrypts.forEach(s => {
                                s.onCollisionStay(collisionData);
                            })

                            if(! rigidBody) return;
                            rigidBody.velocity.y = 0;
                            rigidBody.useGravity = false;


                        }  else {
                            if(! rigidBody) return;
                            rigidBody.useGravity = true;
                        }
                    });
                } 
            });
        });
    }
}


// corrigir => a funcao atualiza para todos os scrypt
// passo um quero o objeto como um componenet atualizado? 