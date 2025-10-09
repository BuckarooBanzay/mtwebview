
export const parsePos = obj => {
    return new Pos(obj.x, obj.y, obj.z)
}

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

    isWithinArea(min, max) {
        return (
            this.x >= min.x && this.y >= min.y && this.z >= min.z &&
            this.x <= max.x && this.y <= max.y && this.z <= max.z
        )
    }

    add(pos) {
        return new Pos(this.x + pos.x, this.y + pos.y, this.z + pos.z)
    }
}