import { Matrix4 } from "three"

// https://api.minetest.net/nodes/#node-paramtypes
export function facedir_to_matrix(facedir) {
    const m = new Matrix4()

    const axis = Math.floor(facedir / 4)
    const rotation = (facedir % 4) * Math.PI / 2 * -1

    switch (axis) {
    case 0:
        // y+
        m.makeRotationY(rotation)
    }

    //TODO: other axes

    return m
}