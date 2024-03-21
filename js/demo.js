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
        nodedef: nodename => nodedefs[nodename],
        media: filename => fetch(`export/media/${filename}`).then(r => r.arrayBuffer())
    }
});

const pos1 = new Pos(-30, -30, -30)
const pos2 = new Pos(30, 30, 30)
wv.render(pos1, pos2)