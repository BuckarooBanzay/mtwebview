
class Node {
    constructor(id, name, param1, param2) {
        this.id = id
        this.name = name
        this.param1 = param1
        this.param2 = param2
    }

    getDayLight() {
        return this.param1 >> 4
    }

    getNightLight() {
        return this.param1 & 0x0F
    }
}

export default Node

export const IgnoreNode = new Node(-1, "ignore", 0, 0)