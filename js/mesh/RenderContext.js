import { Mesh } from 'three';
import BufferGeometryHelper from './BufferGeometryHelper.js'

export default class {

    // material.uuid -> BufferGeometryHelper
    materialMap = {}

    getGeometryHelper(material) {
        if (!this.materialMap[material.uuid]) {
            this.materialMap[material.uuid] = new BufferGeometryHelper();
        }
    }

    toMesh() {
        const m = new Mesh()
        Object.keys(this.materialMap).forEach(uuid => {
            const bg = this.materialMap[uuid]
            const nm = bg.toMesh()
            if (nm) {
                m.add(nm)
            }
        })
        return m
    }
}