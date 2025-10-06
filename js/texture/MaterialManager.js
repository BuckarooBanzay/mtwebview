import { MeshBasicMaterial, NearestFilter, RepeatWrapping, TextureLoader } from "three";

export default class {
    loader = new TextureLoader()
    cache = {}

    constructor(textureGen) {
        this.textureGen = textureGen
    }

    async createMaterial(material_def) {
        const key = `${JSON.stringify(material_def.texture)}/${material_def.transparent}/${material_def.renderside}`
        if (this.cache[key]) {
            return this.cache[key]
        }

        const dataurl = await this.textureGen.createTexture(material_def.texture)

        const texture = this.loader.load(dataurl)
        texture.magFilter = NearestFilter
        texture.wrapS = RepeatWrapping
        texture.wrapT = RepeatWrapping

        const material = new MeshBasicMaterial({
            map: texture,
            vertexColors: true,
            side: material_def.renderside,
            transparent: material_def.transparent
        })
        this.cache[key] = material
        return material
    }
}