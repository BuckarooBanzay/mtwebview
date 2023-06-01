import { WorldMap } from "../../../map/WorldMap";
import { MapNode } from "../../../util/MapNode";
import { NodeSide } from "../../../types/NodeSide";
import { Pos } from "../../../util/Pos";
import { MaterialManager } from "../../MaterialManager";
import { DrawType } from "./DrawType";
import { SideDirs } from "../../../util/SideDirs";
import { RenderContext } from "../RenderContext";
import { FrontSide, Material, Side } from "three";

export class NormalDrawType implements DrawType {
    init(nodedefs: Map<string, NodeDefinition>, worldmap: WorldMap, matmgr: MaterialManager): Promise<any> {
        this.nodedefs = nodedefs
        this.worldmap = worldmap
        this.matmgr = matmgr

        nodedefs
        .forEach(ndef => {
            if (this.isNodedefOccluding(ndef)) {
                this.occludingNodeIDs.set(ndef.id, true)
            }
        })

        return this.createMaterials()
    }

    nodedefs!: Map<string, NodeDefinition>
    worldmap!: WorldMap
    matmgr!: MaterialManager
    materials = new Map<string, Material>()

    createMaterial(ndef: NodeDefinition, tiledef: string, side: NodeSide, transparent: boolean, drawside: Side): Promise<any> {
        if (!tiledef) {
            return Promise.resolve()
        }
        return this.matmgr.createMaterial(tiledef, transparent, drawside)
        .then(m => {
            const key = this.getMaterialKey(ndef.name, side)
            this.materials.set(key, m)
        })
    }

    createMaterials(): Promise<any> {
        const promises = new Array<Promise<any>>()
        this.nodedefs.forEach(ndef => {
            if (ndef.drawtype == "normal") {
                promises.push(this.createMaterial(ndef, ndef.tiles[0].name, NodeSide.YP, false, FrontSide))
                promises.push(this.createMaterial(ndef, ndef.tiles[1].name, NodeSide.YN, false, FrontSide))
                promises.push(this.createMaterial(ndef, ndef.tiles[2].name, NodeSide.XP, false, FrontSide))
                promises.push(this.createMaterial(ndef, ndef.tiles[3].name, NodeSide.XN, false, FrontSide))
                promises.push(this.createMaterial(ndef, ndef.tiles[4].name, NodeSide.ZP, false, FrontSide))
                promises.push(this.createMaterial(ndef, ndef.tiles[5].name, NodeSide.ZN, false, FrontSide))
            }
        })

        return Promise.all(promises)
    }

    getMaterialKey(nodename: string, side: NodeSide): string {
        return `${nodename}/${side}`
    }

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

        const key = this.getMaterialKey(node.name, side)
        const m = this.materials.get(key)
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