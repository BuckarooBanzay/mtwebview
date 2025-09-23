import Normal from "./drawtype/Normal.js"
import Glasslike from "./drawtype/Glasslike.js"
import RenderContext from "./RenderContext.js"
import Pos from "../util/Pos.js"
import Allfaces from "./drawtype/Allfaces.js"
import Mesh from "./drawtype/Mesh.js"
import Nodebox from "./drawtype/Nodebox.js"

export default class MeshGenerator {

    // name -> instance
    drawTypes = {}

    constructor(worldmap, materialmgr, mediasource) {
        this.worldmap = worldmap
        this.materialmgr = materialmgr
        this.mediasource = mediasource

        this.drawTypes["normal"] = new Normal()
        this.drawTypes["glasslike"] = new Glasslike();
        this.drawTypes["glasslike_framed"] = new Glasslike();
        this.drawTypes["glasslike_framed_optional"] = new Glasslike();
        this.drawTypes["allfaces"] = new Allfaces();
        this.drawTypes["allfaces_optional"] = new Allfaces();
        this.drawTypes["mesh"] = new Mesh();
        this.drawTypes["nodebox"] = new Nodebox();

        Object.keys(this.drawTypes).forEach(dt => {
            this.drawTypes[dt].init(worldmap, materialmgr, mediasource)
        })
    }

    async createMesh(pos1, pos2, progress_callback) {
        progress_callback = progress_callback || function() {}

        const ctx = new RenderContext()
        const total_nodes =
            (pos2.x - pos1.x + 1) *
            (pos2.y - pos1.y + 1) *
            (pos2.z - pos1.z + 1)
        
        let i = 0
        for (let z=pos1.z; z<pos2.z; z++) {
            for (let y=pos1.y; y<pos2.y; y++) {
                for (let x=pos1.x; x<pos2.x; x++) {
                    const pos = new Pos(x,y,z)
                    const node = this.worldmap.getNode(pos)
                    if (!node) {
                        continue
                    }
                    
                    const ndef = this.worldmap.getNodeDef(node.name)
                    if (!ndef) {
                        continue
                    }

                    const dt = this.drawTypes[ndef.drawtype]
                    if (!dt) {
                        continue
                    }

                    i++
                    if (i % 16000 == 0) {
                        const progress = i / total_nodes
                        progress_callback(progress, `${x},${y},${z}`)
                    }

                    await dt.render(ctx, pos, node, ndef)
                }
            }
        }

        return ctx.toMesh()
    }
}