import Normal from "./drawtype/Normal.js"
import Glasslike from "./drawtype/Glasslike.js"
import RenderContext from "./RenderContext.js"
import Allfaces from "./drawtype/Allfaces.js"

export default class {

    // name -> instance
    drawTypes = {}

    constructor(worldmap) {
        this.worldmap = worldmap

        this.drawTypes["normal"] = new Normal()
        this.drawTypes["glasslike"] = new Glasslike();
        this.drawTypes["glasslike_framed"] = new Glasslike();
        this.drawTypes["glasslike_framed_optional"] = new Glasslike();
        this.drawTypes["allfaces"] = new Allfaces();
        this.drawTypes["allfaces_optional"] = new Allfaces();

        Object.keys(this.drawTypes).forEach(dt => {
            this.drawTypes[dt].init(worldmap)
        })
    }

    async createGeometryBundle(mb_pos1, mb_pos2) {
        const ctx = new RenderContext()
        const iter = this.worldmap.getIterator(mb_pos1, mb_pos2)

        while (true) {
            const pos = iter()
            if (!pos) {
                break
            }

            const node = this.worldmap.getNode(pos)
            if (!node) {
                continue
            }

            if (node.name == "air" || node.name == "ignore") {
                // fast continue-check
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

            await dt.render(ctx, pos, node, ndef)
        }

        return ctx.getGeometryBundle()
    }
}