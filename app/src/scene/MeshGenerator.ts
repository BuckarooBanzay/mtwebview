import { Mesh } from "three";
import { WorldMap } from "../map/WorldMap";
import { Pos } from "../util/Pos";
import { MaterialManager } from "./MaterialManager";
import { Mapblock } from "../map/Mapblock";

export class MeshGenerator {
    constructor(
        private worldmap: WorldMap,
        private nodedefs: Map<string, NodeDefinition>,
        private matmgr: MaterialManager) {
            this.populateNodeIDCache()
        }
   
    populateNodeIDCache() {
        this.nodedefs.forEach(ndef => {
            if (ndef.drawtype == "normal") {
                this.occludingNodeIDs.set(ndef.id, true)
            }
        })
    }

    occludingNodeIDs = new Map<number, boolean>()

    isTransparent(block: Mapblock, pos: Pos): boolean {
        //TODO: neighboring mapblocks
        const neighborId = block.getNodeID(pos)
        return this.occludingNodeIDs.get(neighborId) == undefined
    }

    createNodeMesh(nodeid: number, nodename: string, nodedef: NodeDefinition, block: Mapblock): Mesh|null {
        const m = new Mesh()

        for (let x=0; x<16; x++) {
            for (let y=0; y<16; y++) {
                for (let z=0; z<16; z++) {
                    const pos = new Pos(x,y,z)
                    if (block.getNodeID(pos) != nodeid) {
                        // skip node
                        continue
                    }

                    if (this.isTransparent(block, new Pos(pos.x, pos.y+1, pos.z))) {
                        // TODO
                    }
                }
            }
        }

        return m
    }

    createMesh(pos: Pos): Mesh|null {
        const m = new Mesh()
        const block = this.worldmap.getBlock(pos)
        if (!block) {
            return null
        }

        const mapping = block.getNodeMapping()
        mapping.forEach((nodeid: number, nodename: string) => {
            // create mesh for each node-type
            const nodedef = this.nodedefs.get(nodename)
            if (!nodedef) {
                throw new Error("nodedef not found: " + nodename)
            }
            const nm = this.createNodeMesh(nodeid, nodename, nodedef, block)
            if (nm) {
                m.add(nm)
            }
        })

        return m
    }

}