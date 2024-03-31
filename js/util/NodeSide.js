import { Matrix4 } from "three"
import Pos from "./Pos.js"

export default {
    XP: {
        dir: new Pos(1,0,0),
        rotationmatrix: new Matrix4().makeRotationY(-Math.PI/2)
    },
    XN: {
        dir: new Pos(-1,0,0),
        rotationmatrix: new Matrix4().makeRotationY(Math.PI/2)
    },
    YP: {
        dir: new Pos(0,1,0),
        rotationmatrix: new Matrix4().makeRotationX(-Math.PI/2)
    },
    YN: {
        dir: new Pos(0,-1,0),
        rotationmatrix: new Matrix4().makeRotationX(Math.PI/2)
    },
    ZP: {
        dir: new Pos(0,0,1),
        rotationmatrix: new Matrix4()
    },
    ZN: {
        dir: new Pos(0,0,-1),
        rotationmatrix: new Matrix4().makeRotationY(Math.PI)
    }
}
