import { WorldMap } from "../../../map/WorldMap";
import { MapNode } from "../../../util/MapNode";
import { NodeSide } from "../../../types/NodeSide";
import { Pos } from "../../../util/Pos";
import { MaterialManager } from "../../MaterialManager";
import { DrawType, RenderContext } from "./DrawType";
import { SideDirs } from "../../../util/SideDirs";

export class NormalDrawType implements DrawType {
    init(nodedefs: Map<string, NodeDefinition>, worldmap: WorldMap, matmgr: MaterialManager) {
        this.nodedefs = nodedefs
        this.worldmap = worldmap
        this.matmgr = matmgr

        nodedefs
        .forEach(ndef => {
            if (this.isNodedefOccluding(ndef)) {
                this.occludingNodeIDs.set(ndef.id, true)
            }
        })
    }

    nodedefs!: Map<string, NodeDefinition>
    worldmap!: WorldMap
    matmgr!: MaterialManager

    occludingNodeIDs = new Map<number, boolean>()

    isNodedefOccluding(ndef: NodeDefinition): boolean {
        return ndef.drawtype == "normal"
    }

    isTransparent(pos: Pos): boolean {
        const node = this.worldmap.getNode(pos)
        if (node == null) {
            return false
        }

        return this.occludingNodeIDs.get(node.id) == undefined
    }

    render(ctx: RenderContext, pos: Pos, node: MapNode, side: NodeSide): void {
        const neighbor_dir = SideDirs[side]
        const neighbor_pos = pos.add(neighbor_dir)

        if (!this.isTransparent(neighbor_pos)){
            return
        }
        const m = this.matmgr.getMaterial(node.name, side)
        if (!m){
            return
        }

        const neighbor_node = this.worldmap.getNode(neighbor_pos)
        let light = 1
        if (neighbor_node){
            //TODO: proper light calc
            light = (neighbor_node.param1 & 0x0F) / 15
        }

        const bg = ctx.getGeometryHelper(m)
        bg.createNodeMeshSide(pos, side, light)
    }
}