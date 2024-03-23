
export class NodedefManager {
    constructor(private url: string) {}

    nodedefmap = new Map<string, NodeDefinition>()

    load(): Promise<number> {
        return fetch(this.url)
        .then(r => r.json())
        .then(d => d as NodeDefinition[])
        .then(ndefs => {
            ndefs.forEach(nd => this.nodedefmap.set(nd.name, nd))
            return ndefs.length
        })
    }

    get(name: string): NodeDefinition|null {
        const def = this.nodedefmap.get(name)
        return def == undefined ? null : def
    }
}