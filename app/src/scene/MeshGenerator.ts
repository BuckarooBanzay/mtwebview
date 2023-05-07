import { BufferAttribute, BufferGeometry, Material, Mesh } from "three";
import { WorldMap } from "../map/WorldMap";
import { Pos } from "../util/Pos";
import { MaterialManager } from "./MaterialManager";
import { Mapblock } from "../map/Mapblock";
import { NodeSide } from "../types/NodeSide";

class GeometryData {
    constructor(public material: Material){}
    vertices = new Array<number>
    uvs = new Array<number>
    colors = new Array<number>
}

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
        console.log(`Creating mesh for node ${nodename} and mapblock ${block.pos}`)

        // material-uuid -> GeometryData
        const datamap = new Map<string, GeometryData>()

        for (let x=0; x<16; x++) {
            for (let y=0; y<16; y++) {
                for (let z=0; z<16; z++) {
                    const pos = new Pos(x,y,z)
                    if (block.getNodeID(pos) != nodeid) {
                        // skip node
                        continue
                    }

                    if (this.isTransparent(block, new Pos(pos.x, pos.y+1, pos.z))) {
                        const m = this.matmgr.getMaterial(nodename, NodeSide.XP)
                        if (m) {
                            console.log(`Would render ${nodename}/${NodeSide.XP} on pos ${pos} in mapblock ${block.pos}`)

                            var gd: GeometryData
                            if (!datamap.has(m.uuid)) {
                                gd = new GeometryData(m)
                                datamap.set(m.uuid, gd)
                            } else {
                                gd = datamap.get(m.uuid)!
                            }

                            gd.vertices.push(
                                pos.x-0.5, pos.y+0.5, pos.z+0.5,
                                pos.x+0.5, pos.y+0.5, pos.z+0.5,
                                pos.x+0.5, pos.y+0.5, pos.z-0.5,
                            
                                pos.x-0.5, pos.y+0.5, pos.z+0.5,
                                pos.x+0.5, pos.y+0.5, pos.z-0.5,
                                pos.x-0.5, pos.y+0.5, pos.z-0.5,
                            )

                            gd.uvs.push(
                                0.0, 0.0,
                                1.0, 0.0,
                                1.0, 1.0,
                            
                                0.0, 0.0,
                                1.0, 1.0,
                                0.0, 1.0,
                            )

                            gd.colors.push(
                                1, 1, 1,
                                1, 1, 1,
                                1, 1, 1,

                                1, 1, 1,
                                1, 1, 1,
                                1, 1, 1,
                            )
                        }
                    }
                }
            }
        }

        const m = new Mesh() //holds the meshes for each side

        datamap.forEach(gd => {
            const geometry = new BufferGeometry()
            geometry.setAttribute('position', new BufferAttribute(new Float32Array(gd.vertices), 3))
            geometry.setAttribute('uv', new BufferAttribute(new Float32Array(gd.uvs), 2))
            geometry.setAttribute('color', new BufferAttribute(new Float32Array(gd.colors), 3))

            const mesh = new Mesh(geometry, gd.material)
            m.add(mesh)
        })

        return m
    }

    createMesh(pos: Pos): Mesh|null {
        const m = new Mesh()
        const block = this.worldmap.getBlock(pos)
        if (!block) {
            return null
        }

        const mapping = block.getNodeMapping()
        Object.keys(mapping).forEach(nodename => {
            // create mesh for each node-type
            const nodedef = this.nodedefs.get(nodename)
            if (!nodedef) {
                return
            }
            const nm = this.createNodeMesh(mapping[nodename], nodename, nodedef, block)
            if (nm) {
                m.add(nm)
            }
        })

        return m
    }

}