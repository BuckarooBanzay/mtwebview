import { MeshBasicMaterial, Color, FrontSide } from "three";

export default class {

    constructor(colormapping) {
        this.colormapping = colormapping
    }

    materials = {}
    cache = {}

    getMaterial(color) {
        const key = `${color.R}/${color.G}/${color.B}/${color.A}`
        if (!this.materials[key]) {
            const c = new Color().setRGB( color.R/255, color.G/255, color.B/255 );
            this.materials[key] = new MeshBasicMaterial({
                color: c,
                side: FrontSide,
                vertexColors: true,
            })
        }

        return this.materials[key]
    }

    async createMaterial(material_def) {
        const key = `${JSON.stringify(material_def.texture)}/${material_def.transparent}/${material_def.renderside}`
        if (this.cache[key]) {
            return this.cache[key]
        }

        const color = this.colormapping[material_def.nodename]
        if (!color) {
            return
        }

        const material = this.getMaterial(color)
        this.cache[key] = material
        return material
    }
}