
export default class Pos {
    constructor(x,y,z) {
        this.x = x
        this.y = y
        this.z = z
    }

    toMapblockPos() {
        return new Pos(Math.floor(this.x / 16), Math.floor(this.y / 16), Math.floor(this.z / 16))
    }

    add(pos) {
        return new Pos(this.x + pos.x, this.y + pos.y, this.z + pos.z)
    }
}