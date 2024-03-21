import NodeSide from "../../util/NodeSide.js"
import { FrontSide } from "three"

const sidelist = Object.keys(NodeSide)

export default class {

    init(worldmap, matmgr) {
        this.worldmap = worldmap
        this.matmgr = matmgr
    }

    isDrawtypeOccluding(drawtype) {
        return (drawtype == "normal")
    }

    getTextureDef(tiles, side) {
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

    async render(ctx, pos, node, nodedef) {
        for (let i=0; i<sidelist.length; i++) {
            const sidename = sidelist[i]
            const dir = NodeSide[sidename]
            const neighbor_pos = pos.add(dir)

            const neighbor_node = this.worldmap.getNode(neighbor_pos)
            const neighbor_nodedef = this.worldmap.getNodeDef(neighbor_node.name)

            if (this.isDrawtypeOccluding(neighbor_nodedef.drawtype)) {
                // side not visible
                continue
            }

            const texture_def = this.getTextureDef(nodedef.tiles, dir)

            const material = await this.matmgr.createMaterial(texture_def, false, FrontSide)

            let light = neighbor_node.getNightLight() / 15

            const bg = ctx.getGeometryHelper(material)
            bg.createNodeMeshSide(pos, dir, light)
        }
    }

}