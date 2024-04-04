import { Color, FrontSide, Matrix4 } from "three";
import Base from "./Base.js";
import NodeSide from "../../util/NodeSide.js";
import { facedir_to_matrix } from "../../util/Facedir.js";

const sidelist = Object.keys(NodeSide)

export default class extends Base {

    processNodebox(gh, box, pos, c, side, nodedef, node) {
        let size_x, size_y, center_x, center_y, offset_y
        if (side == NodeSide.YP) {
            size_x = box[3] - box[0]
            size_y = box[5] - box[2]
            center_x = (box[0] + box[3]) / 2
            center_y = (box[2] + box[5]) / 2
            offset_y = box[4]
        } else if (side == NodeSide.YN) {
            size_x = box[3] - box[0]
            size_y = box[5] - box[2]
            center_x = (box[0] + box[3]) / 2
            center_y = (box[2] + box[5]) / 2
            offset_y = box[1]
        } else if (side == NodeSide.ZN) {
            // wip
            size_x = box[3] - box[0]
            size_y = box[4] - box[1]
            center_x = (box[0] + box[3]) / 2
            center_y = (box[1] + box[4]) / 2
            offset_y = box[2]
        } else {
            return
        }

        const m = new Matrix4()
        m.multiply(new Matrix4().makeTranslation(pos.x * -1, pos.y, pos.z))
        if (nodedef.paramtype2 == "facedir") {
            m.multiply(facedir_to_matrix(node.param2))
        }

        m.multiply(new Matrix4().makeTranslation(center_x, box[4], center_y))
        m.multiply(side.rotationmatrix)

        gh.addPlane(m, c, size_x, size_y)
    }

    async render(ctx, pos, node, nodedef) {
        if (nodedef.node_box.type != "fixed" || !nodedef.node_box.fixed || nodedef.node_box.fixed.length == 0) {
            return
        }

        for (let i=0; i<sidelist.length; i++) {
            const sidename = sidelist[i]
            const side = NodeSide[sidename]
            const neighbor_pos = pos.add(side.dir)

            const texture_def = this.getTextureDef(nodedef, side)
            const material = await this.matmgr.createMaterial(texture_def, true, FrontSide, true)
            const light = (this.worldmap.getParam1(pos.add(side.dir)) & 0x0F) / 15

            const gh = ctx.getBufferGeometryHelper(material)
            const c = new Color(light, light, light)

            if (typeof(nodedef.node_box.fixed[0][0]) == "number") {
                // list of nodeboxes
                nodedef.node_box.fixed.forEach(box => {
                    this.processNodebox(gh, box, pos, c, side, nodedef, node)
                })
            } else {
                // single nodeboxe
                this.processNodebox(gh, nodedef.node_box.fixed, pos, c, side, nodedef, node)
            }
        }
    }
}