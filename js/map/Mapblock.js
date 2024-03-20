
export default class {
    constructor(mapblock_def) {
        this.node_ids = new Int16Array(mapblock_def.node_ids)
        this.param1 = new Uint8Array(mapblock_def.param1)
        this.param2 = new Uint8Array(mapblock_def.param2)
    }
}