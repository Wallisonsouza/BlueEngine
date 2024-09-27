import GameObject from "../components/GameObject";
import { Sprite2D } from "../../Engine2D/Components/Sprite2D";
import { Material2D } from "../../Engine2D/Material/Material2D";
import SpriteRenderer2D from "../../components/SpriteRenderer2D";
import Camera from "../../components/Camera";
import MeshRenderer from "../../components/MeshRenderer";
import Material3D from "../../Engine2D/Material/Material3D";
import MeshBuilder from "./MeshFactory";
import Vector2 from "../../../engine_modules/vectors/Vector2";

export default class EntityBuilder {

    public static createSquare(): GameObject {

        const square = new GameObject("new Square");
        const spriteRenderer = new SpriteRenderer2D();
        const sprite = new Sprite2D();
        const material = new Material2D();
        material.setTexture("./character.png");

        spriteRenderer.sprite = sprite;
        spriteRenderer.material = material;

        square.addComponentInstance(spriteRenderer);
        // square.addComponent(BoxCollider);
        return square;
    }

    public static createCircle(): GameObject {

        const circle = new GameObject("new Circle");
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
        const triangle = new GameObject("new Triangle");
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
        const camera = new GameObject("new Camera");
        const cam = new Camera();
        camera.addComponentInstance(cam);
      
        return camera;
    }

    public static createCube() {
        const cube = new GameObject("new Cube");
        const mesh = MeshBuilder.createCube();
        const meshRenderer = new MeshRenderer();
        const material = new Material3D();
        material.tiling = new Vector2(1, 1);
        material.setAlbedo("/brick/Poliigon_BrickWallReclaimed_8320_BaseColor.jpg");
        material.setNormalMap("/brick/Poliigon_BrickWallReclaimed_8320_Normal.png");
        meshRenderer.material = material;
        meshRenderer.mesh = mesh;
        cube.addComponentInstance(meshRenderer);
      
        return cube;
    }
}