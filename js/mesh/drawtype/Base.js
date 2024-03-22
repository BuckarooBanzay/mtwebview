import NodeSide from "../../util/NodeSide.js"
import { FrontSide } from "three"
import Pos from "../../util/Pos.js"

const sidelist = Object.keys(NodeSide)

export default class {

    init(worldmap, matmgr) {
        this.worldmap = worldmap
        this.matmgr = matmgr
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

    getLighting(pos, dir) {
        if (dir == NodeSide.YN) {
            return [
                (this.worldmap.getParam1(pos.add(new Pos(1,-1,1))) & 0x0F) / 15,
                (this.worldmap.getParam1(pos.add(new Pos(-1,-1,1))) & 0x0F) / 15,
                (this.worldmap.getParam1(pos.add(new Pos(-1,-1,-1))) & 0x0F) / 15,
                (this.worldmap.getParam1(pos.add(new Pos(1,-1,-1))) & 0x0F) / 15,
            ]
        }

        return [1,1,1,1]
    }

    async render(ctx, pos, node, nodedef) {
        const transparent = this.isTransparent()
        const renderside = this.getRenderSide()
    
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

            const texture_def = this.getTextureDef(nodedef, dir)
            const material = await this.matmgr.createMaterial(texture_def, transparent, renderside)
            const lighting = this.getLighting(pos, dir)

            const bg = ctx.getGeometryHelper(material)
            bg.createNodeMeshSide(pos, dir, lighting)
        }
    }


}