import NodeSide from "../../util/NodeSide.js"
import { Color, FrontSide } from "three"

const sidelist = Object.keys(NodeSide)

export default class {

    init(worldmap) {
        this.worldmap = worldmap
    }

    isDrawtypeOccluding(drawtype) {
        return (drawtype == "normal")
    }

    getTextureDef(nodedef, side) {
        const tiles = nodedef.tiles
        if (side == NodeSide.YP || tiles.length == 1) {
            return tiles[0]
        }
        if (side == NodeSide.YN || tiles.length <= 2) {
            return tiles[1]
        }
        if (side == NodeSide.XP || tiles.length <= 3) {
            return tiles[2]
        }
        if (side == NodeSide.XN || tiles.length <= 4) {
            return tiles[3]
        }
        if (side == NodeSide.ZP || tiles.length <= 5) {
            return tiles[4]
        }
        if (side == NodeSide.ZN) {
            return tiles[5]
        }
    }

    isTransparent() {
        return false
    }

    getRenderSide() {
        return FrontSide
    }

    async render(ctx, pos, node, nodedef) {
        const transparent = this.isTransparent()
        const renderside = this.getRenderSide()
    
        for (let i=0; i<sidelist.length; i++) {
            const sidename = sidelist[i]
            const side = NodeSide[sidename]
            const neighbor_pos = pos.add(side.dir)

            const neighbor_node = this.worldmap.getNode(neighbor_pos)
            const neighbor_nodedef = this.worldmap.getNodeDef(neighbor_node.name)

            if (!neighbor_nodedef || this.isDrawtypeOccluding(neighbor_nodedef.drawtype)) {
                // side not visible
                continue
            }

            const texture_def = this.getTextureDef(nodedef, side)

            const light = (neighbor_node.param1 & 0x0F) / 15
            let c = new Color(light, light, light)

            if (neighbor_nodedef.post_effect_color) {
                c = new Color(
                    neighbor_nodedef.post_effect_color.r / 256,
                    neighbor_nodedef.post_effect_color.g / 256,
                    neighbor_nodedef.post_effect_color.b / 256
                )
            }

            const material_def = {
                texture: texture_def,
                transparent: transparent,
                renderside: renderside,
                nodename: node.name
            }
            const gh = ctx.getBufferGeometryHelper(material_def)
            gh.addCubeSide(pos, side, c)
        }
    }

}