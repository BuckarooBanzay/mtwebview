import Node from "../util/Node.js"

export default class {
    constructor(mapblock_def) {
        this.name_id_mapping = mapblock_def.node_mapping
        this.id_name_mapping = {}
        Object.keys(this.name_id_mapping).forEach(name => {
            const id = this.name_id_mapping[name]
            this.id_name_mapping[id] = name
        })

        this.node_ids = new Int16Array(mapblock_def.mapdata, 0, 4096)
        this.param1 = new Uint8Array(mapblock_def.mapdata, 4096*2, 4096)
        this.param2 = new Uint8Array(mapblock_def.mapdata, 4096*3, 4096)
    }

    getNodeNames() {
        return Object.keys(this.name_id_mapping)
    }

    getNode(pos) {
        const index = this.getIndex(pos)
        const id = this.node_ids[index]
        const name = this.id_name_mapping[id]
        return new Node(id, name, this.param1[index], this.param2[index])
    }

    getParam1(pos) {
        const index = this.getIndex(pos)
        return this.param1[index]
    }

    getIndex(pos) {
        return pos.x + (pos.y * 16) + (pos.z * 256);
    }
}