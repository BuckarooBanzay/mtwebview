import { Mesh } from "three"
import { WorldMap } from "../../../map/WorldMap"
import { Pos } from "../../../util/Pos"
import { MaterialManager } from "../../MaterialManager"

export interface DrawType {
    getDrawType(): string
    init(nodedefs: Map<string, NodeDefinition>, worldmap: WorldMap, matmgr: MaterialManager): void
    createMesh(from: Pos, to: Pos): Mesh|null
}