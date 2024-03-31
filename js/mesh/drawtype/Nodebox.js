import { PlaneGeometry } from "three";
import Base from "./Base.js";

export default class extends Base {
    async render(ctx, pos, node, nodedef) {
        if (nodedef.node_box.type != "fixed") {
            return
        }

        console.log(pos, node, nodedef)
        // TODO
        console.log(new PlaneGeometry(1,1))
    }
}