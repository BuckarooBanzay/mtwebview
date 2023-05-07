
export class MediaManager {
    constructor(private basepath: string) {}

    cache = new Map<string, Blob>()

    getMedia(name: string): Promise<Blob|null> {
        if (this.cache.has(name)) {
            const blob = this.cache.get(name)
            return Promise.resolve(blob == undefined ? null : blob)
        }

        return fetch(`${this.basepath}/${name}`)
        .then(r => r.blob())
        .then(b => {
            this.cache.set(name, b)
            return b
        })
    }
}