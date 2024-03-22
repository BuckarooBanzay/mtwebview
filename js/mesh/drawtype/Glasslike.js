import Base from "./Base.js";

export default class extends Base {
    isTransparent() {
        return true
    }

    getTextureDef(nodedef) {
        if (nodedef.tiles.length == 2) {
            return nodedef.tiles[0] + "^" + nodedef.tiles[1]
        } else {
            return super.getTextureDef(nodedef)
        }
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