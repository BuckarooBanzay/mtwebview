import { NodeSide } from "../types/NodeSide"
import { rotate_face, rotate_side } from "./Facedir"

describe("facedir", () => {
    test("rotate_side", () => {
        expect(rotate_side(NodeSide.XN, 0)).toBe(NodeSide.XN)
    })

    test("rotate_face", () => {
        expect(rotate_face(NodeSide.XN, 0)).toBe(0)
    })
})