import { Mesh } from 'three';
import BufferGeometryHelper from './BufferGeometryHelper.js';

export default class {

    // material_def-key -> Helper
    bufferHelperMap = {}

    // material_def-key -> material_def
    materialDefMap = {}

    getMaterialDefKey(material_def) {
        return `${material_def.texture}/${material_def.transparent}/${material_def.renderside}`
    }

    getBufferGeometryHelper(material_def) {
        const key = this.getMaterialDefKey(material_def)

        if (!this.bufferHelperMap[key]) {
            this.bufferHelperMap[key] = new BufferGeometryHelper()
            this.materialDefMap[key] = material_def
        }
        return this.bufferHelperMap[key]
    }

    getGeometryBundle() {
        const bundle = []

        Object.keys(this.bufferHelperMap).forEach(key => {
            const helper = this.bufferHelperMap[key]
            const geo = helper.createGeometry()

            const entry = {
                material_def: this.materialDefMap[key],
                geometry: {
                    index: geo.getIndex().array,
                    position: geo.getAttribute("position").array,
                    uv: geo.getAttribute("uv").array,
                    color: geo.getAttribute("color").array
                }
            }

            bundle.push(entry)
        })

        return bundle
    }

    addMesh(m) {
        this.meshes.push(m)
    }

    toMesh() {
        const meshgroup = new Mesh()
        // raw buffer
        Object.values(this.bufferHelperMap).forEach(h => {
            const mesh = h.createMesh()
            if (mesh) {
                meshgroup.add(mesh)
            }
        })
        // custom meshes
        this.meshes.forEach(mesh => meshgroup.add(mesh))
        return meshgroup
    }
}