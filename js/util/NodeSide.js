import { Matrix4 } from "three"
import Pos from "./Pos.js"

class NodeSide {
    constructor(dir, rotationmatrix) {
        this.dir = dir,
        this.rotationmatrix = rotationmatrix
    }
}

export default {
    XP: new NodeSide(new Pos(1,0,0), new Matrix4().makeRotationY(-Math.PI/2)),
    XN: new NodeSide(new Pos(-1,0,0), new Matrix4().makeRotationY(Math.PI/2)),
    YP: new NodeSide(new Pos(0,1,0), new Matrix4().makeRotationX(-Math.PI/2)),
    YN: new NodeSide(new Pos(0,-1,0), new Matrix4().makeRotationX(Math.PI/2)),
    ZP: new NodeSide(new Pos(0,0,1), new Matrix4()),
    ZN: new NodeSide(new Pos(0,0,-1), new Matrix4().makeRotationY(Math.PI))
}
