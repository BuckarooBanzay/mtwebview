import { Mesh } from 'three';
import BufferGeometryHelper from './BufferGeometryHelper.js'

export default class {

    // material.uuid -> BufferGeometryHelper
    helperMap = {}
    materialMap = {}

    getGeometryHelper(material) {
        if (!this.helperMap[material.uuid]) {
            this.helperMap[material.uuid] = new BufferGeometryHelper();
            this.materialMap[material.uuid] = material
        }
        return this.helperMap[material.uuid]
    }

    toMesh() {
        const m = new Mesh()
        Object.keys(this.helperMap).forEach(uuid => {
            const bg = this.helperMap[uuid]
            const geometry = bg.createGeometry()
            if (geometry) {
                m.add(new Mesh(geometry, this.materialMap[uuid]))
            }
        })
        return m
    }
}