import { MapblockPos, Manifest } from "../types/Manifest";
import { MapNode } from "../types/MapNode";
import { MapblockData } from "../types/MapblockData";
import { Pos } from "../util/Pos";
import { Mapblock } from "./Mapblock";

export class WorldMap {
    constructor(private baseurl: string){}

    world = new Map<string, Mapblock>()

    min_block_pos = new Pos(0,0,0)
    max_block_pos = new Pos(0,0,0)

    formatPos(pos: MapblockPos): string {
        return `${pos.x}/${pos.y}/${pos.z}`
    }

    getBlock(pos: MapblockPos): Mapblock|null {
        const key = this.formatPos(pos)
        const b = this.world.get(key)
        return b == undefined ? null : b
    }

    getNode(pos: Pos): MapNode|null {
        const mb_x = Math.floor(pos.x / 16)
        const mb_y = Math.floor(pos.y / 16)
        const mb_z = Math.floor(pos.z / 16)

        const mb_pos = {x:mb_x, y:mb_y, z:mb_z} as MapblockPos
        const inblock_pos = new Pos(pos.x - (mb_x*16), pos.y - (mb_y*16), pos.z - (mb_z*16))

        const b = this.getBlock(mb_pos)
        if (!b) {
            return null
        }

        return b.getNode(inblock_pos)
    }

    load(): Promise<number> {
        return fetch(`${this.baseurl}/manifest.json`)
        .then(r => r.json())
        .then(b => b as Manifest)
        .then(m => {
            const promises = new Array<Promise<void>>()
            m.forEach(entry => {
                const p = fetch(`${this.baseurl}/${entry.filename}`)
                .then(r => r.json())
                .then(b => b as MapblockData)
                .then(b => {
                    this.max_block_pos.x = Math.max(entry.pos.x, this.max_block_pos.x)
                    this.min_block_pos.x = Math.min(entry.pos.x, this.min_block_pos.x)
                    this.max_block_pos.y = Math.max(entry.pos.y, this.max_block_pos.y)
                    this.min_block_pos.y = Math.min(entry.pos.y, this.min_block_pos.y)
                    this.max_block_pos.z = Math.max(entry.pos.z, this.max_block_pos.z)
                    this.min_block_pos.z = Math.min(entry.pos.z, this.min_block_pos.z)

                    const key = this.formatPos(entry.pos)
                    this.world.set(key, new Mapblock(b, new Pos(entry.pos.x, entry.pos.y, entry.pos.z)))
                })
                promises.push(p)
            })
            return Promise.all(promises)
        })
        .then(() => this.world.size)
    }
}