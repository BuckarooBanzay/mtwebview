import { MeshBasicMaterial, NearestFilter, RepeatWrapping, TextureLoader } from "three";

export default class {
    loader = new TextureLoader()
    cache = {}

    constructor(textureGen, wireframe) {
        this.textureGen = textureGen
        this.wireframe = wireframe || false
    }

    async createMaterial(tiledef, transparent, drawside) {
        const key = `${tiledef}/${transparent}/${drawside}`
        if (this.cache[key]) {
            return this.cache[key]
        }

        const dataurl = await this.textureGen.createTexture(tiledef)
        const texture = this.loader.load(dataurl)
        texture.magFilter = NearestFilter
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping
        
        const material = new MeshBasicMaterial({
            map: texture,
            vertexColors: true,
            wireframe: this.wireframe,
            side: drawside,
            transparent: transparent,
        })

        this.cache[key] = material
        return material
    }
}