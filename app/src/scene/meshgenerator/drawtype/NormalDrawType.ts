import { Material, Mesh } from "three";
import { WorldMap } from "../../../map/WorldMap";
import { MapNode } from "../../../util/MapNode";
import { NodeSide } from "../../../types/NodeSide";
import { Pos } from "../../../util/Pos";
import { MaterialManager } from "../../MaterialManager";
import { DrawType, RenderContext } from "./DrawType";
import { SideDirs } from "../../../util/SideDirs";

const x_neg_pos = new Pos(-1, 0, 0)

export class NormalDrawType implements DrawType {
    getDrawType(): string {
        return "normal"
    }

    init(nodedefs: Map<string, NodeDefinition>, worldmap: WorldMap, matmgr: MaterialManager) {
        this.nodedefs = nodedefs
        this.worldmap = worldmap
        this.matmgr = matmgr

        nodedefs.forEach(ndef => {
            if (ndef.drawtype == "normal") {
                this.occludingNodeIDs.set(ndef.id, true)
            }
        })
    }

    nodedefs!: Map<string, NodeDefinition>
    worldmap!: WorldMap
    matmgr!: MaterialManager

    occludingNodeIDs = new Map<number, boolean>()

    isTransparent(pos: Pos): boolean {
        const node = this.worldmap.getNode(pos)
        if (node == null) {
            return false
        }

        return this.occludingNodeIDs.get(node.id) == undefined
    }

    last_node: MapNode|undefined
    last_material: Material|undefined
    last_light: number|undefined

    resetContext(): void {
        this.last_node = undefined
        this.last_material = undefined
        this.last_light = undefined
    }

    onNewXStride(): void {
        this.resetContext()
    }

    render(ctx: RenderContext, pos: Pos, node: MapNode, side: NodeSide): void {
        const neighbor_dir = SideDirs[side]
        const neighbor_pos = pos.add(neighbor_dir)

        if (!this.isTransparent(neighbor_pos)){
            this.resetContext()
            return
        }
        const m = this.matmgr.getMaterial(node.name, side)
        if (!m){
            this.resetContext()
            return
        }

        const neighbor_node = this.worldmap.getNode(neighbor_pos)
        let light = 1
        if (neighbor_node){
            //TODO: proper light calc
            light = (neighbor_node.param1 & 0xF) / 15
        }

        const x_neg_node = this.worldmap.getNode(pos.add(x_neg_pos))
        const bg = ctx.getGeometryHelper(m)

        if (this.last_material == m &&
            this.last_light == light &&
            this.last_node && node.equals(this.last_node) &&
            x_neg_node && this.last_node.equals(x_neg_node) &&
            (side == NodeSide.YP || side == NodeSide.YN || side == NodeSide.ZN || side == NodeSide.ZP)) {
                // expand previous vertices to x+ direction
                bg.expandLastNodeMeshSideXP(side)
            } else {
                // create new vertices
                bg.createNodeMeshSide(pos, side, light)
            }
        
        this.last_node = node
        this.last_material = m
        this.last_light = light
    }
}