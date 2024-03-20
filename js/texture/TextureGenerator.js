import TileDefinitionParser from "./TileDefinitionParser.js";
import UnknownNodePNG from "./UnknownNodePNG.js";

export default class {
    constructor(mediasource) {
        this.mediasource = mediasource;
    }

    getImageObject(image) {
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
    createTexture(tiledef) {
        return new Promise(resolve => {
            const parts = TileDefinitionParser(tiledef)
                .filter(p => p.image) // filter out image-only parts, ignore the rest for now
            if (parts.length == 0) {
                // nothing to show
                resolve(UnknownNodePNG)
            }

            const promises = parts.map(p => this.getImageObject(p.image))
            Promise.all(promises).then(images => {
                const canvas = document.createElement("canvas")
                canvas.height = images[0].height;
                canvas.width = images[0].width;
                const ctx = canvas.getContext("2d")

                images.forEach(img => {
                    ctx.drawImage(img, 0, 0)
                })

                resolve(canvas.toDataURL())
            })
            .catch(e => {
                // fallback
                console.warn("createTexture: ", e)
                resolve(UnknownNodePNG)
            })
        })
    }
}