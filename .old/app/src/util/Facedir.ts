import { NodeSide } from "../types/NodeSide";

/*
Values range 0 - 23
facedir / 4 = axis direction: 0 = y+, 1 = z+, 2 = z-, 3 = x+, 4 = x-, 5 = y-
The node is rotated 90 degrees around the X or Z axis so that its top face points in the desired direction. For the y- direction, it's rotated 180 degrees around the Z axis.
facedir modulo 4 = left-handed rotation around the specified axis, in 90° steps.
By default, on placement the param2 is automatically set to the horizontal direction the player was looking at (values 0-3)
Special case: If the node is a connected nodebox, the nodebox will NOT rotate, only the textures will.
*/

export function rotate_side(side: NodeSide, param2: number): NodeSide {
    return side //TODO
}

export function rotate_face(side: NodeSide, param2: number): number {
    return 0 //TODO
}