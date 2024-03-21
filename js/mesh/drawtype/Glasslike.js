import Base from "./Base.js";
import { DoubleSide } from "three"

export default class extends Base {
    isTransparent() {
        return true
    }

    getTextureDef(nodedef) {
        return nodedef.tiles[0] + "^" + nodedef.tiles[1]
    }

    getRenderSide() {
        return DoubleSide
    }

    isDrawtypeOccluding(drawtype) {
        return (
            drawtype == "normal" ||
            drawtype == "glasslike" ||
            drawtype == "glasslike_framed" ||
            drawtype == "glasslike_framed_optional"
        )
    }

}