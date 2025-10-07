import BufferGeometryHelper from './BufferGeometryHelper.js';
import { serializeBufferGeometry } from '../util/Serialize.js'

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
                geometry: serializeBufferGeometry(geo)
            }

            bundle.push(entry)
        })

        return bundle
    }
}