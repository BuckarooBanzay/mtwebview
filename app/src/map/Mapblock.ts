import { MapNode } from "../types/MapNode";
import { MapblockData } from "../types/MapblockData";
import { Pos } from "../util/Pos";

export class Mapblock {
    constructor(public mb: MapblockData, public pos: Pos) {
        Object.keys(mb.node_mapping).forEach(name => {
            this.id_name_mapping.set(mb.node_mapping[name], name)
        })
    }

    id_name_mapping = new Map<number, string>()

    getNode(pos: Pos): MapNode {
        const index = this.getIndex(pos)
        const id = this.mb.node_ids[index]
        return {
            id: id,
            name: this.id_name_mapping.get(id),
            param1: this.mb.param1[index],
            param2: this.mb.param2[index]
        } as MapNode
    }

    getNodeMapping(): { [key: string]: number } {
        return this.mb.node_mapping
    }

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