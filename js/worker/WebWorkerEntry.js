import WorldMap from '../map/WorldMap.js';
import GeometryGenerator from '../mesh/GeometryGenerator.js';
import { parsePos } from '../util/Pos.js';

export const is_worker = () => (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)

let worldmap, geogen;

async function init(config) {
    const nodedefs = await fetch(config.nodedefs_url).then(r => r.json());

    worldmap = new WorldMap(config.mapblocks_url, nodedefs)
    geogen = new GeometryGenerator(worldmap)
}

async function render(mb_pos1, mb_pos2) {
    const start = Date.now()

    await worldmap.loadMapblockArea(mb_pos1, mb_pos2)
    const bundle = await geogen.createGeometryBundle(mb_pos1.getMinMapblockPos(), mb_pos2.getMaxMapblockPos())

    const diff = Date.now() - start
    console.log(`rendering done in ${diff} ms`)

    return bundle
}

export const init_worker = () => {
    onmessage = async e => {
        switch (e.data.type) {
            case "init":
                await init()
                postMessage({ id: e.data.id })
                break
            case "render":
                var bundle = await render(parsePos(e.data.mb_pos1), parsePos(e.data.mb_pos2))
                postMessage({ bundle, id: e.data.id })
                break
        }
    }
}
