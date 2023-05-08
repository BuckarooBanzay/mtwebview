
export class Pos {
    constructor(public x: number, public y: number, public z: number) {}

    copy(): Pos {
        return new Pos(this.x, this.y, this.z)
    }

    multiply(pos: Pos) {
        this.x *= pos.x
        this.y *= pos.y
        this.z *= pos.z
    }

    add(pos: Pos) {
        this.x += pos.x
        this.y += pos.y
        this.z += pos.z
    }

    public toString(): string {
        return `(${this.x},${this.y},${this.z})`
    }
}