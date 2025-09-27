import { MeshBasicMaterial, NearestFilter, RepeatWrapping, ImageBitmapLoader, CanvasTexture } from "three";

export default class {
    loader = new ImageBitmapLoader()
    cache = {}

    constructor(textureGen, wireframe) {
        this.textureGen = textureGen
        this.wireframe = wireframe || false
    }

    async createMaterial(tiledef, transparent, drawside, vertexColors) {
        const key = `${JSON.stringify(tiledef)}/${transparent}/${drawside}/${vertexColors}`
        if (this.cache[key]) {
            return this.cache[key]
        }

        const dataurl = await this.textureGen.createTexture(tiledef)

        return new Promise(resolve => {
            console.log("loading texture", { dataurl, tiledef })
            this.loader.load(dataurl, imageBitmap => {
                const texture = new CanvasTexture(imageBitmap);
                texture.magFilter = NearestFilter
                texture.wrapS = RepeatWrapping
                texture.wrapT = RepeatWrapping

                const material = new MeshBasicMaterial({
                    map: texture,
                    vertexColors: vertexColors,
                    wireframe: this.wireframe,
                    side: drawside,
                    transparent: transparent,
                })

                this.cache[key] = material
                resolve(material)
            })
        })
    }
}