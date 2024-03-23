import { WorldMap } from "../../../map/WorldMap"
import { Pos } from "../../../util/Pos"
import { MaterialManager } from "../../MaterialManager"
import { MapNode } from "../../../util/MapNode"
import { NodeSide } from "../../../types/NodeSide"
import { RenderContext } from "../RenderContext"
import { MaterialCache } from "../../MaterialCache"

export interface DrawType {
    init(nodedefs: Map<string, NodeDefinition>, worldmap: WorldMap, matcache: MaterialCache): Promise<any>
    render(ctx: RenderContext, pos: Pos, node: MapNode, side: NodeSide): void
}