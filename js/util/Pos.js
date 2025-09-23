
export default class Pos {
    constructor(x,y,z) {
        this.x = x
        this.y = y
        this.z = z
    }

    // pos -> mb_pos
    toMapblockPos() {
        return new Pos(Math.floor(this.x / 16), Math.floor(this.y / 16), Math.floor(this.z / 16))
    }

    // mb_pos -> pos
    getMinMapblockPos() {
        return new Pos(this.x * 16, this.y * 16, this.z * 16)
    }

    // mb_pos -> pos
    getMaxMapblockPos() {
        return new Pos((this.x * 16) + 15, (this.y * 16) + 15, (this.z * 16) + 15)
    }

    add(pos) {
        return new Pos(this.x + pos.x, this.y + pos.y, this.z + pos.z)
    }
}