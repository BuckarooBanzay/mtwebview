import WebView from './WebView.js';
import Pos from './util/Pos.js';
import { decompressSync } from 'fflate';

const nodedefs = await fetch("export/nodedefs.json").then(r => r.json());
const manifest = await fetch("export/mapblocks/manifest.json").then(r => r.json());

function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

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
                    const buf = base64ToArrayBuffer(mb.mapdata);
                    const decompressed = decompressSync(new Uint8Array(buf))

                    resolve({
                        node_mapping: mb.node_mapping,
                        buffer: decompressed.buffer
                    })
                });
            } else {
                resolve(null);
            }
        }),
        nodedef: nodename => Promise.resolve(nodedefs[nodename]),
        media: filename => Promise.resolve(`export/media/${filename}`)
    }
});

const pos1 = new Pos(manifest.min.x, manifest.min.y, manifest.min.z)
const pos2 = new Pos(manifest.max.x, manifest.max.y, manifest.max.z)

const t1 = Date.now()
await wv.render(pos1, pos2)
const diff = Date.now() - t1
console.log("Initial render/generate time: " + diff + " ms")
