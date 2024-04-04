import { Color, FrontSide, Matrix4 } from "three";
import Base from "./Base.js";
import NodeSide from "../../util/NodeSide.js";

const sidelist = Object.keys(NodeSide)

export default class extends Base {

    

    async render(ctx, pos, node, nodedef) {
        if (nodedef.node_box.type != "fixed" || !nodedef.node_box.fixed) {
            return
        }

        console.log(nodedef)

        for (let i=0; i<sidelist.length; i++) {
            const sidename = sidelist[i]
            const side = NodeSide[sidename]
            const neighbor_pos = pos.add(side.dir)

            const texture_def = this.getTextureDef(nodedef, side)
            const material = await this.matmgr.createMaterial(texture_def, true, FrontSide, true)
            const light = (this.worldmap.getParam1(pos.add(side.dir)) & 0x0F) / 15

            const gh = ctx.getBufferGeometryHelper(material)
            const c = new Color(light, light, light)

            if (side == NodeSide.YP) {
                nodedef.node_box.fixed.forEach(box => {
                    const size_x = box[3] - box[0]
                    const size_y = box[5] - box[2]

                    const m = new Matrix4()
                    m.multiply(new Matrix4().makeTranslation(pos.x * -1, pos.y, pos.z))
                    m.multiply(side.rotationmatrix)
                    m.multiply(new Matrix4().makeTranslation(box[0] + (size_x / 2), box[3] - (size_y / 2), box[4]))

                    gh.addPlane(m, c, size_x, size_y)
                })
            }

        }
    }
}