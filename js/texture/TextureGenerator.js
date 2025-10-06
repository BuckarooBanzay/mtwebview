import TileDefinitionParser from "./TileDefinitionParser.js";
import UnknownNodePNG from "./UnknownNodePNG.js";

export default class {
    constructor(mediasource) {
        this.mediasource = mediasource;
    }

    async getImageObject(image) {
        return new Promise((resolve, reject) => {
             this.mediasource(image)
                .then(url => {
                    const el = document.createElement("img");
                    el.onload = () => resolve(el)
                    el.onerror = () => reject("image error: '" + url + "'")
                    el.src = url
                })
            })
    }

    // returns: Promise<Data-URL>
    async createTexture(tiledef) {
        const parts = TileDefinitionParser(tiledef)
            .filter(p => p.image) // filter out image-only parts, ignore the rest for now
        if (parts.length == 0) {
            // nothing to show
            return UnknownNodePNG
        }

        const promises = parts.map(p => this.getImageObject(p.image))
        return await Promise.all(promises).then(images => {
            const canvas = document.createElement("canvas")
            canvas.height = images[0].height;
            canvas.width = images[0].width;

            const ctx = canvas.getContext("2d")

            images.forEach(img => {
                ctx.drawImage(img, 0, 0)
            })

            return canvas.toDataURL()
        })
        .catch(e => {
            // fallback
            console.warn("createTexture: ", e)
            return UnknownNodePNG
        })
    }
}