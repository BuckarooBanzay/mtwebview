import RenderContext from "./RenderContext.js"
import Pos from "../util/Pos.js"
import NodeSide from "../util/NodeSide.js"

const sidelist = Object.keys(NodeSide)

export default class {

    constructor(worldmap, colormapping) {
        this.worldmap = worldmap
        this.colormapping = colormapping
    }

    async createGeometryBundle(pos1, pos2) {
        const ctx = new RenderContext()

        for (let z=pos1.z; z<pos2.z; z++) {
            for (let y=pos1.y; y<pos2.y; y++) {
                for (let x=pos1.x; x<pos2.x; x++) {
                    const pos = new Pos(x,y,z)
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
                    // TODO
                    await dt.render(ctx, pos, node, ndef)
                }
            }
        }

        return ctx.getGeometryBundle()
    }
}