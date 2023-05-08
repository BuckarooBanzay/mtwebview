import { Pos } from "./Pos"

describe("Pos", () => {
    test("functions", () => {
        const p = new Pos(1, 2, 3)
        expect(p.x).toBe(1)
        expect(p.y).toBe(2)
        expect(p.z).toBe(3)

        p.add(new Pos(1,2,3))
        expect(p.x).toBe(2)
        expect(p.y).toBe(4)
        expect(p.z).toBe(6)

        p.multiply(new Pos(2,2,2))
        expect(p.x).toBe(4)
        expect(p.y).toBe(8)
        expect(p.z).toBe(12)
    })
})