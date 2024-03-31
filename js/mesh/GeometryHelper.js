import { InstancedMesh, Matrix4, PlaneGeometry } from "three";

const plane_geometry = new PlaneGeometry(1, 1);

export default class {

    constructor(material) {
        this.material = material
    }

    matrixlist = []
    colorlist = []

    addPlane(pos, side, color) {
        const m = new Matrix4()
            .makeTranslation(
                (pos.x*-1) + (side.dir.x*-0.5),
                pos.y + side.dir.y*0.5,
                pos.z + side.dir.z*0.5
            )
            .multiply(side.rotationmatrix)
            

        this.matrixlist.push(m)
        this.colorlist.push(color)
    }

    createMesh() {
        const im = new InstancedMesh(plane_geometry, this.material, this.matrixlist.length)
        for (let i=0; i<this.matrixlist.length; i++) {
            im.setMatrixAt(i, this.matrixlist[i])
            im.setColorAt(i, this.colorlist[i])
        }
        return im
    }
}