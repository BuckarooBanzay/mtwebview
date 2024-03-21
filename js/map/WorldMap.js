import Pos from "../util/Pos.js"
import Mapblock from "./Mapblock.js"
import { IgnoreNode } from "../util/Node.js"

export default class {

    // pos_string -> block
    map = {}

    constructor(mapblockloader) {
        this.mapblockloader = mapblockloader
    }

    loadMapblock(mbpos) {
        const key = this.formatPos(mbpos)
        if (this.map[key]) {
            // already loaded
            return Promise.resolve()
        }
        // load from provider
        return this.mapblockloader(mbpos)
            .then(mapblock_def => {
                if (!mapblock_def) {
                    return
                }
                const mb = new Mapblock(mapblock_def)
                this.map[key] = mb
                console.log(mb)
            })
    }

    loadArea(pos1, pos2) {
        const promises = []
        const mb_pos1 = pos1.toMapblockPos()
        const mb_pos2 = pos2.toMapblockPos()

        for (let x=mb_pos1.x; x<mb_pos2.x; x++) {
            for (let y=mb_pos1.y; y<mb_pos2.y; y++) {
                for (let z=mb_pos1.z; z<mb_pos2.z; z++) {
                    const mb_pos = new Pos(x,y,z)
                    promises.push(this.loadMapblock(mb_pos))
                }
            }
        }

        return Promise.all(promises)
    }

    formatPos(pos) {
        return `${pos.x}/${pos.y}/${pos.z}`
    }

    getBlock(mbpos) {
        const key = this.formatPos(mbpos)
        return this.map[key]
    }

    getNode(pos) {
        const mb_pos = pos.toMapblockPos()
        const inblock_pos = new Pos(pos.x - (mb_pos.x*16), pos.y - (mb_pos.y*16), pos.z - (mb_pos.z*16))

        const b = this.getBlock(mb_pos)
        if (!b) {
            return IgnoreNode
        }

        return b.getNode(inblock_pos)
    }
}