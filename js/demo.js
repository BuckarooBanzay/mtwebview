import WebView from './WebView.js';
import Pos from './util/Pos.js';

const nodedefs = await fetch("export/nodedefs.json").then(r => r.json());
const manifest = await fetch("export/mapblocks/manifest.json").then(r => r.json());

const wv = new WebView({
    target: document.getElementById("scene"),
    wireframe: false,
    source: {
        mapblock: pos => new Promise(resolve => {
            const pos_str = `(${pos.x},${pos.y},${pos.z})`;
            if (manifest.mapblocks[pos_str]) {
                fetch(`export/mapblocks/${pos_str}.json`)
                .then(r => r.json())
                .then(mb => resolve(mb));
            } else {
                resolve(null);
            }
        }),
        nodedef: nodename => Promise.resolve(nodedefs[nodename]),
        media: filename => Promise.resolve(`export/media/${filename}`)
    }
});

const pos1 = new Pos(manifest.min.x, manifest.min.y, manifest.min.z)
const pos2 = new Pos(manifest.max.x, manifest.max.y, manifest.max.x, )

const t1 = Date.now()
await wv.render(pos1, pos2)
const diff = Date.now() - t1
console.log("Initial render/generate time: " + diff + " ms")