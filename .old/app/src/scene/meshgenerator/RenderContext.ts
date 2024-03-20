import { Material, Mesh } from "three"
import { BufferGeometryHelper } from "./BufferGeometryHelper"

export class RenderContext {
    constructor() {}

    datamap = new Map<string, BufferGeometryHelper>()

    getGeometryHelper(m: Material): BufferGeometryHelper {
        let bg = this.datamap.get(m.uuid)
        if (!bg) {
            bg = new BufferGeometryHelper(m)
            this.datamap.set(m.uuid, bg)
        }
        return bg
    }

    toMesh(): Mesh {
        const m = new Mesh()
        this.datamap.forEach(bg => {
            const nm = bg.toMesh()
            if (nm) {
                m.add(nm)
            }
        })
        return m
    }
}