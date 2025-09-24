import TileDefinitionParser from "./TileDefinitionParser.js";
import UnknownNodePNG from "./UnknownNodePNG.js";

export default class {
    constructor(mediasource) {
        this.mediasource = mediasource;
    }

    async getImageObject(image) {
        const url = await this.mediasource(image)
        const blob = await fetch(url).then(r => r.blob())
        return createImageBitmap(blob)
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
            const canvas = new OffscreenCanvas(images[0].width, images[0].height)
            const ctx = canvas.getContext("2d")

            images.forEach(img => {
                ctx.drawImage(img, 0, 0)
            })

            return canvas.convertToBlob()
        })
        .then(blob => URL.createObjectURL(blob))
        .catch(e => {
            // fallback
            console.warn("createTexture: ", e)
            return UnknownNodePNG
        })
    }
}