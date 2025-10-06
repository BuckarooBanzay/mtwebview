
export class WebWorker {

    constructor(scriptfile = "js/bundle.js") {
        this.worker = new Worker(scriptfile)
    }

    terminate() {
        this.worker.terminate()
    }

    async init() {
        this.worker.postMessage({
            type: "init"
        })
        // TODO: promise, onmessage
    }

    async render_geometries() {

    }
}