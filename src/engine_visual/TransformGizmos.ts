import Quaternion from "../../engine_modules/vectors/Quaternion";
import Vector3 from "../../engine_modules/vectors/Vector3";
import Input from "../Base/Input/Input";
import Ray from "../Base/Mathf/Ray";
import Gizmos from "../Engine/graphycs/Gizmos";
import Transform from "../components/Transform";
import Color from "../Engine/static/color";
import BoxCollider from "../Engine/components/BoxCollider";
import Camera from "../components/Camera";
import { WindowScreen } from "../main";

let xCollider = new BoxCollider();
let moving: {colision: boolean, axis: "X" | "Y" | "Z"| null} = {colision: false, axis: null};

export function drawTransformGizmos(transform: Transform) {

    const camera = Camera.main.camera;
    const cameraPosition = camera.transform.position;

    const distance = Math.max(0.1, Vector3.distance(transform.position, cameraPosition));

    const t = distance * 0.2;
    const globalXAxis = transform.right.multiplyScalar(t);
    const globalYAxis = transform.upward.multiplyScalar(t);
    const globalZAxis = transform.forward.multiplyScalar(t);

    const xEnd = transform.position.add(globalXAxis);
    const yEnd = transform.position.add(globalYAxis);
    const zEnd = transform.position.add(globalZAxis);

    Gizmos.color = Color.red;
    Gizmos.drawLine(transform.position, xEnd);
    Gizmos.color = Color.green;
    Gizmos.drawLine(transform.position, yEnd);
    Gizmos.color = Color.blue;
    Gizmos.drawLine(transform.position, zEnd);


    const ray = camera.screenPointToRay(Input.mousePosition);

   
    xCollider.setGameObject(transform.gameObject);
    xCollider.size = new Vector3(t / 2, 0.02 * t, 0.02 * t);
    


    if(xCollider.raycast(ray, Infinity)) {

        moving.colision = true;
        moving.axis = "X";
        xCollider.color = Color.green;
     
    } else {
        xCollider.color = Color.red;
    }


    if (Input.getMouseButton(0) && moving.colision) {
        const mouseDelta = Input.mouseDelta;
        transform.translate(new Vector3(mouseDelta.x * 0.01));
    }
    
}

export function rayIntersectsLine(ray: Ray, start: Vector3, end: Vector3, threshold: number = 0.05): boolean {
    const lineDir = end.subtract(start).normalize();
    const lineLength = Vector3.distance(start, end);

    // Projeção do ponto mais próximo no raio na linha
    const projection = ray.direction.cross(lineDir).normalize();
    const distance = Math.abs(ray.origin.subtract(start).dot(projection));

    // Verifica se o ponto mais próximo está dentro da linha
    const t = ray.direction.dot(end.subtract(ray.origin)) / ray.direction.dot(ray.direction);
    const closestPoint = ray.origin.add(ray.direction.multiplyScalar(t));

    // Verifica se está dentro da linha e se a distância é menor que o threshold
    const withinLineBounds = closestPoint.subtract(start).length() <= lineLength;
    return distance < threshold && withinLineBounds;
}

