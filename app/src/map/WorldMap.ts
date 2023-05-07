import { MapblockPos, Manifest } from "../types/Manifest";
import { MapblockData } from "../types/MapblockData";

export class WorldMap {
    constructor(private baseurl: string){}

    world = new Map<string, MapblockData>()

    formatPos(pos: MapblockPos): string {
        return `${pos.x}/${pos.y}/${pos.z}`
    }

    getBlockData(pos: MapblockPos): MapblockData|null {
        const key = this.formatPos(pos)
        const b = this.world.get(key)
        return b == undefined ? null : b
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
                    const key = this.formatPos(entry.pos)
                    this.world.set(key, b)
                })
                promises.push(p)
            })
            return Promise.all(promises)
        })
        .then(() => this.world.size)
    }
}