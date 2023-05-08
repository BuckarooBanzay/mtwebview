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
    indices = new Array<number>
    max_index = 0
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

    isTransparent(block_pos: Pos, pos: Pos): boolean {
        // neighboring mapblocks
        if (pos.x < 0) {
            const neighbor_pos = new Pos(block_pos.x-1, block_pos.y, block_pos.z)
            return this.isTransparent(neighbor_pos, new Pos(pos.x+16, pos.y, pos.z))
        }
        if (pos.x > 15) {
            const neighbor_pos = new Pos(block_pos.x+1, block_pos.y, block_pos.z)
            return this.isTransparent(neighbor_pos, new Pos(pos.x-16, pos.y, pos.z))
        }
        if (pos.y < 0) {
            const neighbor_pos = new Pos(block_pos.x, block_pos.y-1, block_pos.z)
            return this.isTransparent(neighbor_pos, new Pos(pos.x, pos.y+16, pos.z))
        }
        if (pos.y > 15) {
            const neighbor_pos = new Pos(block_pos.x, block_pos.y+1, block_pos.z)
            return this.isTransparent(neighbor_pos, new Pos(pos.x, pos.y-16, pos.z))
        }
        if (pos.z < 0) {
            const neighbor_pos = new Pos(block_pos.x, block_pos.y, block_pos.z-1)
            return this.isTransparent(neighbor_pos, new Pos(pos.x, pos.y, pos.z+16))
        }
        if (pos.z > 15) {
            const neighbor_pos = new Pos(block_pos.x, block_pos.y, block_pos.z+1)
            return this.isTransparent(neighbor_pos, new Pos(pos.x, pos.y, pos.z-16))
        }

        const block = this.worldmap.getBlock(block_pos)
        if (block == null) {
            return true
        }
        const neighborId = block.getNodeID(pos)
        return this.occludingNodeIDs.get(neighborId) == undefined
    }

    createNodeMeshSide(block: Mapblock, pos: Pos, side: NodeSide, gd: GeometryData) {
        const default_uvs = [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ]

        const o = gd.max_index
        gd.max_index += 4
        const default_indices_pos = [
            o+0, o+1, o+2,
            o+0, o+2, o+3
        ]
        const default_indices_neg = [
            o+2, o+1, o+0,
            o+3, o+2, o+0
        ]

        gd.uvs.push(...default_uvs)
        let lightnode_pos: Pos

        switch (side) {
            case NodeSide.YP:
                gd.vertices.push(
                    16-pos.x-0.5, pos.y+0.5, pos.z+0.5,
                    16-pos.x+0.5, pos.y+0.5, pos.z+0.5,
                    16-pos.x+0.5, pos.y+0.5, pos.z-0.5,
                    16-pos.x-0.5, pos.y+0.5, pos.z-0.5,
                )
        
                gd.indices.push(...default_indices_pos)
                lightnode_pos = new Pos(pos.x, pos.y+1, pos.z)
                break;
            case NodeSide.YN:
                gd.vertices.push(
                    16-pos.x-0.5, pos.y-0.5, pos.z+0.5,
                    16-pos.x+0.5, pos.y-0.5, pos.z+0.5,
                    16-pos.x+0.5, pos.y-0.5, pos.z-0.5,
                    16-pos.x-0.5, pos.y-0.5, pos.z-0.5,
                )
        
                gd.indices.push(...default_indices_neg)
                lightnode_pos = new Pos(pos.x, pos.y-1, pos.z)
                break;
            case NodeSide.XN: //inverted x-axis
                gd.vertices.push(
                    16-pos.x+0.5, pos.y-0.5, pos.z+0.5,
                    16-pos.x+0.5, pos.y-0.5, pos.z-0.5,
                    16-pos.x+0.5, pos.y+0.5, pos.z-0.5,
                    16-pos.x+0.5, pos.y+0.5, pos.z+0.5,
                )
        
                gd.indices.push(...default_indices_pos)
                lightnode_pos = new Pos(pos.x-1, pos.y, pos.z)
                break;
            case NodeSide.XP: //inverted x-axis
                gd.vertices.push(
                    16-pos.x-0.5, pos.y-0.5, pos.z+0.5,
                    16-pos.x-0.5, pos.y-0.5, pos.z-0.5,
                    16-pos.x-0.5, pos.y+0.5, pos.z-0.5,
                    16-pos.x-0.5, pos.y+0.5, pos.z+0.5,
                )
        
                gd.indices.push(...default_indices_neg)
                lightnode_pos = new Pos(pos.x+1, pos.y, pos.z)
                break;
            case NodeSide.ZP:
                gd.vertices.push(
                    16-pos.x-0.5, pos.y-0.5, pos.z+0.5,
                    16-pos.x+0.5, pos.y-0.5, pos.z+0.5,
                    16-pos.x+0.5, pos.y+0.5, pos.z+0.5,
                    16-pos.x-0.5, pos.y+0.5, pos.z+0.5,
                )
        
                gd.indices.push(...default_indices_pos)
                lightnode_pos = new Pos(pos.x, pos.y, pos.z+1)
                break;
            case NodeSide.ZN:
                gd.vertices.push(
                    16-pos.x-0.5, pos.y-0.5, pos.z-0.5,
                    16-pos.x+0.5, pos.y-0.5, pos.z-0.5,
                    16-pos.x+0.5, pos.y+0.5, pos.z-0.5,
                    16-pos.x-0.5, pos.y+0.5, pos.z-0.5,
                )
        
                gd.indices.push(...default_indices_neg)
                lightnode_pos = new Pos(pos.x, pos.y, pos.z-1)
                break;
        }

        const param1 = block.getParam1(lightnode_pos)
        const l = (param1 / 15) + 0.1

        const default_colors = []
        for (let i=0; i<12; i++) {
            default_colors.push(l)
        }
        gd.colors.push(...default_colors)

    }

    createOrGetGeometryData(datamap: Map<string, GeometryData>, m: Material): GeometryData {
        var gd: GeometryData
        if (!datamap.has(m.uuid)) {
            gd = new GeometryData(m)
            datamap.set(m.uuid, gd)
        } else {
            gd = datamap.get(m.uuid)!
        }
        return gd
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

                    if (this.isTransparent(block.pos, new Pos(pos.x, pos.y+1, pos.z))) {
                        const m = this.matmgr.getMaterial(nodename, NodeSide.YP)
                        if (m) {
                            const gd = this.createOrGetGeometryData(datamap, m)
                            this.createNodeMeshSide(block, pos, NodeSide.YP, gd)
                        }

                    }

                    if (this.isTransparent(block.pos, new Pos(pos.x, pos.y-1, pos.z))) {
                        const m = this.matmgr.getMaterial(nodename, NodeSide.YN)
                        if (m) {
                            const gd = this.createOrGetGeometryData(datamap, m)
                            this.createNodeMeshSide(block, pos, NodeSide.YN, gd)
                        }

                    }

                    if (this.isTransparent(block.pos, new Pos(pos.x+1, pos.y, pos.z))) {
                        const m = this.matmgr.getMaterial(nodename, NodeSide.XP)
                        if (m) {
                            const gd = this.createOrGetGeometryData(datamap, m)
                            this.createNodeMeshSide(block, pos, NodeSide.XP, gd)
                        }
                    }

                    if (this.isTransparent(block.pos, new Pos(pos.x-1, pos.y, pos.z))) {
                        const m = this.matmgr.getMaterial(nodename, NodeSide.XN)
                        if (m) {
                            const gd = this.createOrGetGeometryData(datamap, m)
                            this.createNodeMeshSide(block, pos, NodeSide.XN, gd)
                        }
                    }

                    if (this.isTransparent(block.pos, new Pos(pos.x, pos.y, pos.z+1))) {
                        const m = this.matmgr.getMaterial(nodename, NodeSide.ZP)
                        if (m) {
                            const gd = this.createOrGetGeometryData(datamap, m)
                            this.createNodeMeshSide(block, pos, NodeSide.ZP, gd)
                        }
                    }

                    if (this.isTransparent(block.pos, new Pos(pos.x, pos.y, pos.z-1))) {
                        const m = this.matmgr.getMaterial(nodename, NodeSide.ZN)
                        if (m) {
                            const gd = this.createOrGetGeometryData(datamap, m)
                            this.createNodeMeshSide(block, pos, NodeSide.ZN, gd)
                        }
                    }
                }
            }
        }

        const m = new Mesh() //holds the meshes for each side

        datamap.forEach(gd => {
            const geometry = new BufferGeometry()
            geometry.setIndex(gd.indices)
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