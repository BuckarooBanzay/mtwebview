import { Pos } from "./Pos"

describe("Pos", () => {
    test("functions", () => {
        const p = new Pos(1, 2, 3)
        expect(p.x).toBe(1)
        expect(p.y).toBe(2)
        expect(p.z).toBe(3)

        const p2 = p.add(new Pos(1,2,3))
        expect(p2.x).toBe(2)
        expect(p2.y).toBe(4)
        expect(p2.z).toBe(6)

        const p3 = p2.multiply(new Pos(2,2,2))
        expect(p3.x).toBe(4)
        expect(p3.y).toBe(8)
        expect(p3.z).toBe(12)
    })
})