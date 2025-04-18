import Pos from "../util/Pos.js"
import Mapblock from "./Mapblock.js"
import { IgnoreNode } from "../util/Node.js"

export default class {

    // pos_string -> block
    map = {}

    // name -> node-def
    nodedefs = {}

    constructor(mapblockloader, nodedefloader) {
        this.mapblockloader = mapblockloader
        this.nodedefloader = nodedefloader
    }

    async loadMapblock(mbpos) {
        const key = this.formatPos(mbpos)
        if (this.map[key]) {
            // already loaded
            return this.map[key]
        }
        // load from provider
        const mapblock_def = await this.mapblockloader(mbpos)
        if (!mapblock_def) {
            return
        }

        const mb = new Mapblock(mapblock_def)
        this.map[key] = mb

        const promises = []
        mb.getNodeNames().forEach(nodename => {
            if (this.nodedefs[nodename]) {
                // already have it
                return
            }

            const promise = this.nodedefloader(nodename)
                .then(node_def => this.nodedefs[nodename] = node_def)
            promises.push(promise)
        })

        await Promise.all(promises)
        return mb
    }

    async loadArea(pos1, pos2, progress_callback) {
        const mb_pos1 = pos1.toMapblockPos()
        const mb_pos2 = pos2.toMapblockPos()

        const total_mapblocks =
            (mb_pos2.x - mb_pos1.x + 1) *
            (mb_pos2.y - mb_pos1.y + 1) *
            (mb_pos2.z - mb_pos1.z + 1)

        let i = 0
        for (let x=mb_pos1.x; x<mb_pos2.x; x++) {
            for (let y=mb_pos1.y; y<mb_pos2.y; y++) {
                for (let z=mb_pos1.z; z<mb_pos2.z; z++) {
                    const mb_pos = new Pos(x,y,z)
                    i++
                    const progress = i / total_mapblocks
                    progress_callback(progress, `${x},${y},${z}`)
                    await this.loadMapblock(mb_pos)
                }
            }
        }
    }

    formatPos(pos) {
        return `${pos.x}/${pos.y}/${pos.z}`
    }

    getBlock(mbpos) {
        const key = this.formatPos(mbpos)
        return this.map[key]
    }

    getNodeDef(nodename) {
        return this.nodedefs[nodename]
    }

    getParam1(pos) {
        const mb_pos = pos.toMapblockPos()

        const b = this.getBlock(mb_pos)
        if (!b) {
            return 15
        }

        const inblock_pos = new Pos(pos.x - (mb_pos.x*16), pos.y - (mb_pos.y*16), pos.z - (mb_pos.z*16))
        return b.getParam1(inblock_pos)
    }

    getNode(pos) {
        const mb_pos = pos.toMapblockPos()

        const b = this.getBlock(mb_pos)
        if (!b) {
            return IgnoreNode
        }

        const inblock_pos = new Pos(pos.x - (mb_pos.x*16), pos.y - (mb_pos.y*16), pos.z - (mb_pos.z*16))
        return b.getNode(inblock_pos)
    }
}