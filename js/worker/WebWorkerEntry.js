import WorldMap from '../map/WorldMap.js';
import GeometryGenerator from '../mesh/GeometryGenerator.js';
import { parseBase64GzMapblock } from '../parser/MapParser.js';
import { parsePos } from '../util/Pos.js';

export const is_worker = () => (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)

let worldmap, geogen, init_done;

async function init() {
    const nodedefs = await fetch("/export/nodedefs.json").then(r => r.json());
    const manifest = await fetch("/export/mapblocks/manifest.json").then(r => r.json());

    worldmap = new WorldMap(
        async pos => {
            const pos_str = `(${pos.x},${pos.y},${pos.z})`;
            if (manifest.mapblocks[pos_str]) {
                const mb = await fetch(`/export/mapblocks/${pos_str}.json`).then(r => r.json())
                return {
                    node_mapping: mb.node_mapping,
                    mapdata: parseBase64GzMapblock(mb.mapdata)
                }
            }
        },
        async nodename => nodedefs[nodename]
    )
    geogen = new GeometryGenerator(worldmap)
}

const queue = []

function dequeue_job() {
    const data = queue.shift()
    if (!data) {
        setTimeout(dequeue_job, 100)
        return
    }

    render(data).then(dequeue_job)
}

async function render(data) {
    await init_done
    const start = Date.now()

    const mb_pos1 = parsePos(data.mb_pos1)
    const mb_pos2 = parsePos(data.mb_pos2)
    await worldmap.loadMapblockArea(mb_pos1, mb_pos2)
    const bundle = await geogen.createGeometryBundle(mb_pos1.getMinMapblockPos(), mb_pos2.getMaxMapblockPos())

    const diff = Date.now() - start
    console.log(`rendering done in ${diff} ms`)

    postMessage({
        type: "bundle",
        bundle: bundle,
        key: data.key
    })
}


export const init_worker = () => {
    dequeue_job()

    onmessage = async e => {
        switch (e.data.type) {
            case "init":
                init_done = init()
                break
            case "render":
                queue.push(e.data)
                break
        }
    }
}
