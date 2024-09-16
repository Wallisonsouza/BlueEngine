import Mesh from "../../Engine/graphycs/Mesh";
import MeshBuilder from "../../Engine/graphycs/MeshFactory";

export class Sprite2D {
    public mesh: Mesh;
    constructor(){
        this.mesh = MeshBuilder.createSquare();
     
    }
}
