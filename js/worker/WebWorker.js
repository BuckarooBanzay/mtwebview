
export class WebWorker {

    // id -> fn()
    resolvers = {}

    constructor(scriptfile = "js/bundle.js") {
        this.worker = new Worker(scriptfile)
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

    async init() {
        return this.postData({ type: "init" })
    }

    async render_geometries() {

    }
}