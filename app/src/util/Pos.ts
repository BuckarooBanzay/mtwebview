
export class Pos {
    constructor(public x: number, public y: number, public z: number) {}

    multiply(pos: Pos): Pos {
        return new Pos(this.x * pos.x, this.y * pos.y, this.z * pos.z)
    }

    add(pos: Pos): Pos {
        return new Pos(this.x + pos.x, this.y + pos.y, this.z + pos.z)
    }

    clone(): Pos {
        return new Pos(this.x, this.y, this.z)
    }

    public toString(): string {
        return `(${this.x},${this.y},${this.z})`
    }
}