import { Color, InstancedMesh, Material, Matrix, Matrix4, Mesh, PlaneGeometry } from "three";
import { Pos } from "../../util/Pos";
import { NodeSide } from "../../types/NodeSide";

const rotations = new Map<NodeSide, Matrix4>()
rotations.set(NodeSide.XP, new Matrix4().makeRotationY(-Math.PI/2))
rotations.set(NodeSide.XN, new Matrix4().makeRotationY(Math.PI/2))
rotations.set(NodeSide.YN, new Matrix4().makeRotationX(Math.PI/2))
rotations.set(NodeSide.YP, new Matrix4().makeRotationX(-Math.PI/2))
rotations.set(NodeSide.ZP, new Matrix4())
rotations.set(NodeSide.ZN, new Matrix4().makeRotationX(Math.PI))

const face_offsets = new Map<NodeSide, Pos>()
// inverted gl/canvas x-position
face_offsets.set(NodeSide.XN, new Pos(-0.5, 0, 0))
face_offsets.set(NodeSide.XP, new Pos(+0.5, 0, 0))
face_offsets.set(NodeSide.YN, new Pos(0, -0.5, 0))
face_offsets.set(NodeSide.YP, new Pos(0, +0.5, 0))
face_offsets.set(NodeSide.ZN, new Pos(0, 0, -0.5))
face_offsets.set(NodeSide.ZP, new Pos(0, 0, +0.5))

const side_geometry = new PlaneGeometry(1, 1);

export class BufferGeometryHelper {
    constructor(public material: Material) {}

    matrices = new Array<Matrix4>()
    colors = new Array<Color>()

    createNodeMeshSide(pos: Pos, side: NodeSide, light: number) {
        // inverted gl/canvas position
        const rotation = rotations.get(side)!
        const face_offset = face_offsets.get(side)!
        const offset = pos.add(face_offset)

        const m = new Matrix4().makeTranslation(offset.x*-1, offset.y, offset.z)
        m.multiply(rotation)
        this.matrices.push(m)
        this.colors.push(new Color(light, light, light))
    }

    toMesh(): Mesh {
        const im = new InstancedMesh(side_geometry, this.material, this.matrices.length)
        for (let i=0; i<this.matrices.length; i++) {
            im.setMatrixAt(i, this.matrices[i])
            im.setColorAt(i, this.colors[i])
        }
        return im
    }
}