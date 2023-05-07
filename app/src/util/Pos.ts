
export class Pos {
    constructor(public x: number, public y: number, public z: number) {}

    public toString(): string {
        return `(${this.x},${this.y},${this.z})`
    }
}