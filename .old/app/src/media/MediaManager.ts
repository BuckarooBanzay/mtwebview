
export class MediaManager {
    constructor(private basepath: string) {}

    cache = new Map<string, Blob>()
    inflight_cache = new Map<string, Promise<Blob|null>>()

    getMedia(name: string): Promise<Blob|null> {
        if (this.cache.has(name)) {
            const blob = this.cache.get(name)
            return Promise.resolve(blob == undefined ? null : blob)
        }

        if (this.inflight_cache.has(name)) {
            return this.inflight_cache.get(name)!
        }

        const p = fetch(`${this.basepath}/${name}`)
        .then(r => r.blob())
        .then(b => {
            this.cache.set(name, b)
            this.inflight_cache.delete(name)
            return b
        })

        this.inflight_cache.set(name, p)
        return p
    }
}