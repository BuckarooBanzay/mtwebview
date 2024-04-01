import { Color, FrontSide } from "three";
import Base from "./Base.js";
import NodeSide from "../../util/NodeSide.js";

const sidelist = Object.keys(NodeSide)

export default class extends Base {
    async render(ctx, pos, node, nodedef) {
        if (nodedef.node_box.type != "fixed") {
            return
        }

        for (let i=0; i<sidelist.length; i++) {
            const sidename = sidelist[i]
            const side = NodeSide[sidename]
            const neighbor_pos = pos.add(side.dir)

            const neighbor_node = this.worldmap.getNode(neighbor_pos)
            const neighbor_nodedef = this.worldmap.getNodeDef(neighbor_node.name)

            if (this.isDrawtypeOccluding(neighbor_nodedef.drawtype)) {
                // side not visible
                continue
            }

            const texture_def = this.getTextureDef(nodedef, side)
            const material = await this.matmgr.createMaterial(texture_def, true, FrontSide, true)
            const light = (this.worldmap.getParam1(pos.add(side.dir)) & 0x0F) / 15

            const gh = ctx.getBufferGeometryHelper(material)
            const c = new Color(light, light, light)

            // TODO: parse nodebox and calculate offset/uv
            gh.addCubeSide(pos, side, c)
        }
    }
}