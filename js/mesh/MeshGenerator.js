import NormalDrawType from "./drawtype/NormalDrawType.js"
import RenderContext from "./RenderContext.js"
import Pos from "../util/Pos.js"

export default class MeshGenerator {

    // name -> instance
    drawTypes = {}

    constructor(worldmap, materialmgr) {
        this.worldmap = worldmap
        this.materialmgr = materialmgr

        this.drawTypes["normal"] = new NormalDrawType()

        Object.keys(this.drawTypes).forEach(dt => {
            this.drawTypes[dt].init(worldmap, materialmgr)
        })
    }

    async createMesh(pos1, pos2) {
        const ctx = new RenderContext()
        
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

                    await dt.render(ctx, pos, node, ndef)
                }
            }
        }

        return ctx.toMesh()
    }
}