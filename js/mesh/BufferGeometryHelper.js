import { BufferAttribute, BufferGeometry, Matrix4, Mesh, Vector3 } from "three"

function vector3_push(a, v) {
    a.push(v.x, v.y, v.z)
}

function color_push(a, c) {
    a.push(c.r,c.g,c.b)
}

export default class {
    constructor(material) {
        this.material = material
    }

    positions = []
    uvs = []
    indices = []
    colors = []
    max_index = 0

    addPlane(matrix, color) {
        const half = 0.5
        const p1 = new Vector3(-half, half, 0)
        const p2 = new Vector3(half, half, 0)
        const p3 = new Vector3(-half, -half, 0)
        const p4 = new Vector3(half, -half, 0)

        p1.applyMatrix4(matrix)
        p2.applyMatrix4(matrix)
        p3.applyMatrix4(matrix)
        p4.applyMatrix4(matrix)

        vector3_push(this.positions, p1)
        vector3_push(this.positions, p2)
        vector3_push(this.positions, p3)
        vector3_push(this.positions, p4)

        this.uvs.push(0,1, 1,1, 0,0, 1,0)
        
        color_push(this.colors, color)
        color_push(this.colors, color)
        color_push(this.colors, color)
        color_push(this.colors, color)

        const o = this.max_index
        this.max_index += 4
        this.indices.push(o+0, o+2, o+1, o+2, o+3, o+1)
    }

    addCubeSide(pos, side, color) {
        const m = new Matrix4()
        m.multiply(new Matrix4().makeTranslation(pos.x * -1, pos.y, pos.z))
        m.multiply(side.rotationmatrix)
        m.multiply(new Matrix4().makeTranslation(0, 0, 0.5))
        return this.addPlane(m, color)
    }

    createMesh() {
        const geo = new BufferGeometry()
        geo.setIndex(this.indices)
        geo.setAttribute('position', new BufferAttribute(new Float32Array(this.positions), 3));
        geo.setAttribute('uv', new BufferAttribute(new Float32Array(this.uvs), 2));
        geo.setAttribute('color', new BufferAttribute(new Float32Array(this.colors), 3));
        geo.computeBoundingBox()

        return new Mesh(geo, this.material)
    }
}