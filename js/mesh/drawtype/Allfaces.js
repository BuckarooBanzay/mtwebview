import Base from "./Base.js";

export default class extends Base {
    isTransparent() {
        return true
    }

    isDrawtypeOccluding(drawtype) {
        return (
            drawtype == "normal"
        )
    }

}