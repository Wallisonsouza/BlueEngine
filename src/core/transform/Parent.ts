import Transform from "./Transform";

export default class TransformHierarchy {
    private _parent: Transform | null = null;
    private _children: Transform[] = [];

    constructor(private readonly owner: Transform) {}

    public get parent(): Transform | null {
        return this._parent;
    }

    public get children(): Transform[] {
        return this._children;
    }

    public get childCount(): number {
        return this._children.length;
    }

    public setParent(newParent: Transform | null): void {
        if (newParent === this.owner) {
            console.error("Um objeto não pode ser pai de si mesmo.");
            return;
        }

        if (this._parent !== newParent) {
            this._parent = newParent;
        }

        if (newParent && !newParent.hierarchy.children.includes(this.owner)) {
            newParent.hierarchy.children.push(this.owner);
        }
    }
}
