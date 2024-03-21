import WebView from './WebView.js';
import Pos from './util/Pos.js';

const nodedefs = await fetch("export/nodedefs.json").then(r => r.json());
const manifest = await fetch("export/mapblocks/manifest.json").then(r => r.json());

const wv = new WebView({
    target: document.getElementById("scene"),
    pos: { x:0, y:0, z:0 },
    source: {
        mapblock: pos => new Promise(resolve => {
            const pos_str = `(${pos.x},${pos.y},${pos.z})`;
            if (manifest[pos_str]) {
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

const pos1 = new Pos(-30, -30, -30)
const pos2 = new Pos(30, 30, 30)

const t1 = Date.now()
await wv.render(pos1, pos2)
const diff = Date.now() - t1
console.log("Render time: " + diff + " ms")