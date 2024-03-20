
export default class Pos {
    constructor(x,y,z) {
        this.x = x || 0
        this.y = y || x
        this.z = z || y || z
    }
}