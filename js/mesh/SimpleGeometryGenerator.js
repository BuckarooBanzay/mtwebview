import RenderContext from "./RenderContext.js"
import NodeSide from "../util/NodeSide.js"
import { Color, FrontSide } from "three"

const sidelist = Object.keys(NodeSide)

export default class {

    constructor(worldmap, colormapping) {
        this.worldmap = worldmap
        this.colormapping = colormapping
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

            for (let i=0; i<sidelist.length; i++) {
                const sidename = sidelist[i]
                const side = NodeSide[sidename]
                const neighbor_pos = pos.add(side.dir)
    
                const neighbor_node = this.worldmap.getNode(neighbor_pos)
                const neighbor_color = this.colormapping[neighbor_node.name]

                if (neighbor_color) {
                    // side not visible
                    continue
                }            
    
                const light = (neighbor_node.param1 & 0x0F) / 15
                let c = new Color(light, light, light)
                
                const material_def = {
                    transparent: false,
                    renderside: FrontSide,
                    nodename: node.name
                }
                const gh = ctx.getBufferGeometryHelper(material_def)
                gh.addCubeSide(pos, side, c)
            }
        }

        return ctx.getGeometryBundle()
    }
}