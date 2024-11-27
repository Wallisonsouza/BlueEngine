import Vector3 from "../engine_modules/module_vectors/Vector3";
import Input from "../../src/core/input/Input";
import Camera from "../../src/core/components/Camera";
import Component from "../../src/core/components/Component";
import { MeshFilter } from "../../src/core/graphics/mesh/MeshRenderer";
import RayCast from "../../src/core/physics/RayCast";
import Transform from "../../src/core/components/Transform";
import BoxCollider from "../src/Engine/components/BoxCollider";
import GameObject from "../src/Engine/components/GameObject";
import MonoComportament, { CollisionData } from "../src/Engine/components/MonoComportament";
import Time from "../../src/core/Time";

export default class GizmosSuport extends MonoComportament {

    private currentObject: GameObject | null = null;

    public update(): void {

       
        // if(Input.getMouseButtonDown(0)) {
        //     const ray = Camera.main.screenPointToRay(Input.mousePosition);
        //     const data = Physics.meshCast(ray, Infinity);

        //     if(data?.hit === true && data.object) {
        //         this.currentObject = data.object;
        //     } else {
        //         this.currentObject = null;
        //     }
        // }

        // if(this.currentObject) {
        //     const components = this.currentObject.getComponents(Component);
        //     components.forEach(c => c.drawGizmos());
        // }
    }

}