import { Material, Mesh } from "three"
import { WorldMap } from "../../../map/WorldMap"
import { Pos } from "../../../util/Pos"
import { MaterialManager } from "../../MaterialManager"
import { BufferGeometryHelper } from "../BufferGeometryHelper"
import { MapNode } from "../../../util/MapNode"
import { NodeSide } from "../../../types/NodeSide"

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

export interface DrawType {
    init(nodedefs: Map<string, NodeDefinition>, worldmap: WorldMap, matmgr: MaterialManager): void
    render(ctx: RenderContext, pos: Pos, node: MapNode, side: NodeSide): void
}