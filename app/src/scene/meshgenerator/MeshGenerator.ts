import { Material, Mesh } from "three";
import { WorldMap } from "../../map/WorldMap";
import { Pos } from "../../util/Pos";
import { MaterialManager } from "../MaterialManager";
import { NodeSide } from "../../types/NodeSide";
import { DrawType } from "./drawtype/DrawType";
import { BufferGeometryHelper } from "./BufferGeometryHelper";

export class MeshGenerator {
    constructor(
        private worldmap: WorldMap,
        private nodedefs: Map<string, NodeDefinition>,
        private matmgr: MaterialManager) {
            this.populateNodeIDCache()
        }
    
    drawtypes = new Map<string, DrawType>()

    registerDrawType(dt: DrawType) {
        this.drawtypes.set(dt.getDrawType(), dt)
    }
   
    populateNodeIDCache() {
        this.nodedefs.forEach(ndef => {
            if (ndef.drawtype == "normal") {
                this.occludingNodeIDs.set(ndef.id, true)
            }
        })
    }

    occludingNodeIDs = new Map<number, boolean>()

    isTransparent(pos: Pos): boolean {
        const node = this.worldmap.getNode(pos)
        if (node == null) {
            return true
        }

        return this.occludingNodeIDs.get(node.id) == undefined
    }

    createOrGetBufferGeometryHelper(datamap: Map<string, BufferGeometryHelper>, m: Material): BufferGeometryHelper {
        var gd: BufferGeometryHelper
        if (!datamap.has(m.uuid)) {
            gd = new BufferGeometryHelper(m)
            datamap.set(m.uuid, gd)
        } else {
            gd = datamap.get(m.uuid)!
        }
        return gd
    }

    createMesh(from: Pos, to: Pos): Mesh|null {
        // material-uuid -> BufferGeometryHelper
        const datamap = new Map<string, BufferGeometryHelper>()

        for (let x=from.x; x<to.x; x++) {
            for (let y=from.y; y<to.y; y++) {
                for (let z=from.z; z<to.z; z++) {
                    const pos = new Pos(x,y,z)
                    const node = this.worldmap.getNode(pos)

                    if (node == null) {
                        // skip node
                        continue
                    }

                    const nodedef = this.nodedefs.get(node.name)
                    if (nodedef == null) {
                        continue
                    }
                    if (nodedef.drawtype != "normal" && nodedef.drawtype != "allfaces_optional") {
                        continue
                    }

                    const checkside = (dir: Pos, side: NodeSide) => {
                        const neighbor_pos = pos.copy()
                        neighbor_pos.add(dir)
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
                            light = (neighbor_node.param1) / 15
                        }

                        const gd = this.createOrGetBufferGeometryHelper(datamap, m)
                        gd.createNodeMeshSide(pos, side, light)
                    }

                    checkside(new Pos(0, 1, 0), NodeSide.YP)
                    checkside(new Pos(0, -1, 0), NodeSide.YN)
                    checkside(new Pos(1, 0, 0), NodeSide.XP)
                    checkside(new Pos(-1, 0, 0), NodeSide.XN)
                    checkside(new Pos(0, 0, 1), NodeSide.ZP)
                    checkside(new Pos(0, 0, -1), NodeSide.ZN)
                }
            }
        }

        const m = new Mesh() //holds the meshes for each side
        datamap.forEach(gd => m.add(gd.toMesh()))
        return m
    }

}