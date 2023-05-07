import { MapblockData } from "../types/MapblockData";
import { Pos } from "../util/Pos";

export class Mapblock {
    constructor(private mb: MapblockData) {}

    getIndex(pos: Pos): number {
        return pos.x + (pos.y * 16) + (pos.z * 256);
    }

    getNodeID(pos: Pos): number {
        return this.mb.node_ids[this.getIndex(pos)]
    }

    getParam1(pos: Pos): number {
        return this.mb.param1[this.getIndex(pos)]
    }

    getParam2(pos: Pos): number {
        return this.mb.param2[this.getIndex(pos)]
    }

}