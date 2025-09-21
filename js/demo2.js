import WebView from './WebView.js';
import decompress_base64 from './decompress_base64.js';
import Pos from './util/Pos.js';

const colormapping = await fetch("colormapping.json").then(r => r.json());
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
                .then(mb => {
                    resolve({
                        node_mapping: mb.node_mapping,
                        buffer: decompress_base64(mb.mapdata)
                    })
                });
            } else {
                resolve(null);
            }
        }),
        colormapping: colormapping
    }
});

const pos1 = new Pos(manifest.min.x, manifest.min.y, manifest.min.z)
const pos2 = new Pos(manifest.max.x, manifest.max.y, manifest.max.z)

const t1 = Date.now()
await wv.render(pos1, pos2, (progress, message) => console.log(`Progress: ${Math.floor(progress*100)}%: ${message}`))
const diff = Date.now() - t1
console.log("Initial render/generate time: " + diff + " ms")
