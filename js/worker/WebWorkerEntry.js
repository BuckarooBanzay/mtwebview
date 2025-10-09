import WorldMap from '../map/WorldMap.js';
import GeometryGenerator from '../mesh/GeometryGenerator.js';
import SimpleGeometryGenerator from '../mesh/SimpleGeometryGenerator.js';
import { parsePos } from '../util/Pos.js';

export const is_worker = () => (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)

let worldmap, geogen;

async function init(config) {
    console.log("WebWorkerEntry", { config })
    worldmap = new WorldMap(config.mapblocks_url, config.nodedefs, parsePos(config.min), parsePos(config.max))

    if (config.nodedefs && config.media_url) {
        // render with textures
        geogen = new GeometryGenerator(worldmap)
    } else {
        // render with plain boxes
        geogen = new SimpleGeometryGenerator(worldmap, config.colormapping)
    }
}

async function render(mb_pos1, mb_pos2) {
    console.log("WebWorkerEntry", { mb_pos1, mb_pos2 })
    const start = Date.now()

    const mapblock_count = await worldmap.loadMapblockArea(mb_pos1, mb_pos2)
    const bundle = await geogen.createGeometryBundle(mb_pos1.getMinMapblockPos(), mb_pos2.getMaxMapblockPos())

    const diff = Date.now() - start
    console.log(`rendering done in ${diff} ms (${mapblock_count} mapblocks, ${bundle.length} entries)`)

    return bundle
}

export const init_worker = () => {
    onmessage = async e => {
        switch (e.data.type) {
            case "init":
                await init(e.data.config)
                postMessage({ id: e.data.id })
                break
            case "render":
                var bundle = await render(parsePos(e.data.mb_pos1), parsePos(e.data.mb_pos2))
                postMessage({ bundle, id: e.data.id })
                break
        }
    }
}
