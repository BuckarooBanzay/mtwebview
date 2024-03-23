import { NodeSide } from "../types/NodeSide";
import { Pos } from "./Pos";

export const SideDirs = {
    [NodeSide.XP]: new Pos(1,0,0),
    [NodeSide.XN]: new Pos(-1,0,0),
    [NodeSide.YP]: new Pos(0,1,0),
    [NodeSide.YN]: new Pos(0,-1,0),
    [NodeSide.ZP]: new Pos(0,0,1),
    [NodeSide.ZN]: new Pos(0,0,-1),
}
