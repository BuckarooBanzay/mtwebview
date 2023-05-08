import { BufferAttribute, BufferGeometry, Material, Mesh } from "three";
import { WorldMap } from "../../map/WorldMap";
import { Pos } from "../../util/Pos";
import { MaterialManager } from "../MaterialManager";
import { Mapblock } from "../../map/Mapblock";
import { NodeSide } from "../../types/NodeSide";

class GeometryData {
    constructor(public material: Material){}
    vertices = new Array<number>
    uvs = new Array<number>
    colors = new Array<number>
    indices = new Array<number>
    max_index = 0
}

const BS = new Pos(16, 16, 16)

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

    isTransparent(pos: Pos): boolean {
        const node = this.worldmap.getNode(pos)
        if (node == null) {
            return true
        }

        return this.occludingNodeIDs.get(node.id) == undefined
    }

    createNodeMeshSide(pos: Pos, side: NodeSide, gd: GeometryData) {
        // inverted gl/canvas position
        const gl_pos = new Pos(pos.x*-1, pos.y, pos.z)

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
                    gl_pos.x-0.5, gl_pos.y+0.5, gl_pos.z+0.5,
                    gl_pos.x+0.5, gl_pos.y+0.5, gl_pos.z+0.5,
                    gl_pos.x+0.5, gl_pos.y+0.5, gl_pos.z-0.5,
                    gl_pos.x-0.5, gl_pos.y+0.5, gl_pos.z-0.5,
                )
        
                gd.indices.push(...default_indices_pos)
                lightnode_pos = new Pos(pos.x, pos.y+1, pos.z)
                break;
            case NodeSide.YN:
                gd.vertices.push(
                    gl_pos.x-0.5, gl_pos.y-0.5, gl_pos.z+0.5,
                    gl_pos.x+0.5, gl_pos.y-0.5, gl_pos.z+0.5,
                    gl_pos.x+0.5, gl_pos.y-0.5, gl_pos.z-0.5,
                    gl_pos.x-0.5, gl_pos.y-0.5, gl_pos.z-0.5,
                )
        
                gd.indices.push(...default_indices_neg)
                lightnode_pos = new Pos(pos.x, pos.y-1, pos.z)
                break;
            case NodeSide.XN: //inverted x-axis
                gd.vertices.push(
                    gl_pos.x+0.5, gl_pos.y-0.5, gl_pos.z+0.5,
                    gl_pos.x+0.5, gl_pos.y-0.5, gl_pos.z-0.5,
                    gl_pos.x+0.5, gl_pos.y+0.5, gl_pos.z-0.5,
                    gl_pos.x+0.5, gl_pos.y+0.5, gl_pos.z+0.5,
                )
        
                gd.indices.push(...default_indices_pos)
                lightnode_pos = new Pos(pos.x-1, pos.y, pos.z)
                break;
            case NodeSide.XP: //inverted x-axis
                gd.vertices.push(
                    gl_pos.x-0.5, gl_pos.y-0.5, gl_pos.z+0.5,
                    gl_pos.x-0.5, gl_pos.y-0.5, gl_pos.z-0.5,
                    gl_pos.x-0.5, gl_pos.y+0.5, gl_pos.z-0.5,
                    gl_pos.x-0.5, gl_pos.y+0.5, gl_pos.z+0.5,
                )
        
                gd.indices.push(...default_indices_neg)
                lightnode_pos = new Pos(pos.x+1, pos.y, pos.z)
                break;
            case NodeSide.ZP:
                gd.vertices.push(
                    gl_pos.x-0.5, gl_pos.y-0.5, gl_pos.z+0.5,
                    gl_pos.x+0.5, gl_pos.y-0.5, gl_pos.z+0.5,
                    gl_pos.x+0.5, gl_pos.y+0.5, gl_pos.z+0.5,
                    gl_pos.x-0.5, gl_pos.y+0.5, gl_pos.z+0.5,
                )
        
                gd.indices.push(...default_indices_pos)
                lightnode_pos = new Pos(pos.x, pos.y, pos.z+1)
                break;
            case NodeSide.ZN:
                gd.vertices.push(
                    gl_pos.x-0.5, gl_pos.y-0.5, gl_pos.z-0.5,
                    gl_pos.x+0.5, gl_pos.y-0.5, gl_pos.z-0.5,
                    gl_pos.x+0.5, gl_pos.y+0.5, gl_pos.z-0.5,
                    gl_pos.x-0.5, gl_pos.y+0.5, gl_pos.z-0.5,
                )
        
                gd.indices.push(...default_indices_neg)
                lightnode_pos = new Pos(pos.x, pos.y, pos.z-1)
                break;
        }

        const lightnode = this.worldmap.getNode(lightnode_pos)
        const l = ((lightnode == null ? 15 : lightnode.param1) / 15) + 0.1

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

    createNodeMesh(nodeid: number, nodename: string, block_pos: Pos): Mesh|null {
        console.log(`Creating mesh for node ${nodename} and mapblock ${block_pos}`)

        // material-uuid -> GeometryData
        const datamap = new Map<string, GeometryData>()

        const block_pos_offset = block_pos.copy()
        block_pos_offset.multiply(BS)

        for (let x=0; x<16; x++) {
            for (let y=0; y<16; y++) {
                for (let z=0; z<16; z++) {
                    const pos = new Pos(x,y,z)
                    pos.add(block_pos_offset)

                    const node = this.worldmap.getNode(pos)

                    if (node == null || node.id != nodeid) {
                        // skip node
                        continue
                    }

                    if (this.isTransparent(new Pos(pos.x, pos.y+1, pos.z))) {
                        const m = this.matmgr.getMaterial(nodename, NodeSide.YP)
                        if (m) {
                            const gd = this.createOrGetGeometryData(datamap, m)
                            this.createNodeMeshSide(pos, NodeSide.YP, gd)
                        }
                    }

                    if (this.isTransparent(new Pos(pos.x, pos.y-1, pos.z))) {
                        const m = this.matmgr.getMaterial(nodename, NodeSide.YN)
                        if (m) {
                            const gd = this.createOrGetGeometryData(datamap, m)
                            this.createNodeMeshSide(pos, NodeSide.YN, gd)
                        }
                    }

                    if (this.isTransparent(new Pos(pos.x+1, pos.y, pos.z))) {
                        const m = this.matmgr.getMaterial(nodename, NodeSide.XP)
                        if (m) {
                            const gd = this.createOrGetGeometryData(datamap, m)
                            this.createNodeMeshSide(pos, NodeSide.XP, gd)
                        }
                    }

                    if (this.isTransparent(new Pos(pos.x-1, pos.y, pos.z))) {
                        const m = this.matmgr.getMaterial(nodename, NodeSide.XN)
                        if (m) {
                            const gd = this.createOrGetGeometryData(datamap, m)
                            this.createNodeMeshSide(pos, NodeSide.XN, gd)
                        }
                    }

                    if (this.isTransparent(new Pos(pos.x, pos.y, pos.z+1))) {
                        const m = this.matmgr.getMaterial(nodename, NodeSide.ZP)
                        if (m) {
                            const gd = this.createOrGetGeometryData(datamap, m)
                            this.createNodeMeshSide(pos, NodeSide.ZP, gd)
                        }
                    }

                    if (this.isTransparent(new Pos(pos.x, pos.y, pos.z-1))) {
                        const m = this.matmgr.getMaterial(nodename, NodeSide.ZN)
                        if (m) {
                            const gd = this.createOrGetGeometryData(datamap, m)
                            this.createNodeMeshSide(pos, NodeSide.ZN, gd)
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

    createMapblockMesh(pos: Pos): Mesh|null {
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
            const nm = this.createNodeMesh(mapping[nodename], nodename, block.pos)
            if (nm) {
                m.add(nm)
            }
        })

        return m
    }

}