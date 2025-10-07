
export class WebWorker {

    // id -> fn()
    resolvers = {}

    constructor(script_url) {
        this.worker = new Worker(script_url)
        this.worker.onmessage = e => this.onMessage(e)
    }

    onMessage(e) {
        const id = e.data.id
        const resolver = this.resolvers[id]
        if (resolver) {
            resolver(e.data)
            delete this.resolvers[id]
        }
    }

    async postData(data) {
        const id = parseInt(Math.random() * 100000)
        data.id = id
        const promise = new Promise(resolve => {
            this.resolvers[id] = resolve
        })
        this.worker.postMessage(data)
        return promise
    }

    terminate() {
        this.worker.terminate()
    }

    async init(config) {
        await this.postData({
            type: "init",
            config
        })
    }

    async render_geometries(mb_pos1, mb_pos2) {
        const data = await this.postData({
            type: "render",
            mb_pos1, mb_pos2
        })
        return data.bundle
    }
}