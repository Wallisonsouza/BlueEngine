import GameObject from "../components/GameObject";
import { Sprite2D } from "../../Engine2D/Components/Sprite2D";
import { Material2D } from "../../Engine2D/Material/Material2D";
import BoxCollider from "../../Engine2D/Components/BoxCollider";
import SpriteRenderer2D from "../../Engine2D/Components/SpriteRenderer2D";
import Camera from "../../components/Camera";
import MeshRenderer from "./MeshRenderer";

export default class EntityBuilder {

    public static createSquare(): GameObject {

        const square = new GameObject("new square");
        const spriteRenderer = new SpriteRenderer2D();
        const sprite = new Sprite2D();
        const material = new Material2D();
        material.setTexture("./src/Engine/Assets/2D/Textures/Square.png");

        spriteRenderer.sprite = sprite;
        spriteRenderer.material = material;

        square.addComponentInstance(spriteRenderer);
        square.addComponent(BoxCollider);
        square.addComponent(MeshRenderer);
        return square;
    }

    public static createCircle(): GameObject {

        const circle = new GameObject("new circle");
        const spriteRenderer = new SpriteRenderer2D();
        const sprite = new Sprite2D();
        const material = new Material2D();
        material.setTexture("./src/Engine/Assets/2D/Textures/character.png");

        spriteRenderer.sprite = sprite;
        spriteRenderer.material = material;

        circle.addComponentInstance(spriteRenderer);
     
      
        return circle;
    }

    public static createTriangle(): GameObject {
        const triangle = new GameObject("new triangle");
        const spriteRenderer = new SpriteRenderer2D();
        const sprite = new Sprite2D();
        const material = new Material2D();
        material.setTexture("./src/Engine/Assets/2D/Textures/Triangle.png");

        spriteRenderer.sprite = sprite;
        spriteRenderer.material = material;

        triangle.addComponentInstance(spriteRenderer);
      
        return triangle;
    }

    public static createCamera(): GameObject{
        const camera = new GameObject("new camera");
        const cam = new Camera();
        camera.addComponentInstance(cam);
      
        return camera;
    }
}