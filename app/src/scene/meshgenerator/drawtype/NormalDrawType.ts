import { Material, Mesh } from "three";
import { WorldMap } from "../../../map/WorldMap";
import { MapNode } from "../../../util/MapNode";
import { NodeSide } from "../../../types/NodeSide";
import { Pos } from "../../../util/Pos";
import { MaterialManager } from "../../MaterialManager";
import { BufferGeometryHelper } from "../BufferGeometryHelper";
import { DrawType } from "./DrawType";
import { SideDirs } from "../../../util/SideDirs";

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
            return true
        }

        return this.occludingNodeIDs.get(node.id) == undefined
    }

    createMesh(from: Pos, to: Pos): Mesh|null {
        // material-uuid -> BufferGeometryHelper
        const datamap = new Map<string, BufferGeometryHelper>()

        for (let z=from.z; z<to.z; z++) {
            for (let y=from.y; y<to.y; y++) {
                for (let n=0; n<6; n++){
                    const side = n as NodeSide
                    const neighbor_dir = SideDirs[side]

                    let last_node: MapNode|null = null
                    let last_light: number|null = null
                    let last_material: Material|null = null

                    for (let x=from.x; x<to.x; x++) {
                        const pos = new Pos(x,y,z)
                        const node = this.worldmap.getNode(pos)

                        if (node == null) {
                            // skip node
                            last_node = null
                            continue
                        }

                        // side-independent checks
                        const nodedef = this.nodedefs.get(node.name)
                        if (nodedef == null) {
                            last_node = null
                            continue
                        }
                        if (nodedef.drawtype != "normal" && nodedef.drawtype != "allfaces_optional") {
                            last_node = null
                            continue
                        }

                        // side-dependent checks
                        const neighbor_pos = pos.add(neighbor_dir)
                        if (!this.isTransparent(neighbor_pos)){
                            last_node = null
                            continue
                        }
                        const m = this.matmgr.getMaterial(node.name, side)
                        if (!m){
                            last_node = null
                            continue
                        }
                        const neighbor_node = this.worldmap.getNode(neighbor_pos)
                        let light = 1
                        if (neighbor_node){
                            light = (neighbor_node.param1) / 15
                        }

                        var gd: BufferGeometryHelper
                        if (!datamap.has(m.uuid)) {
                            gd = new BufferGeometryHelper(m)
                            datamap.set(m.uuid, gd)
                        } else {
                            gd = datamap.get(m.uuid)!
                        }

                        if (last_node != null &&
                            last_material == m &&
                            last_light == light &&
                            last_node.equals(node) &&
                            (side == NodeSide.YP || side == NodeSide.YN || side == NodeSide.ZN || side == NodeSide.ZP)) {
                                // expand previous vertices to x+ direction
                                gd.expandLastNodeMeshSideXP(side)
                            } else {
                                // create new vertices
                                gd.createNodeMeshSide(pos, side, light)
                            }

                        last_node = node
                        last_light = light
                        last_material = m
                    }
                }
            }
        }

        const m = new Mesh() //holds the meshes for each side
        datamap.forEach(gd => m.add(gd.toMesh()))
        return m
    }
}