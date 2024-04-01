import { Mesh } from 'three';
import BufferGeometryHelper from './BufferGeometryHelper.js';

export default class {

    // material.uuid -> Helper
    bufferHelperMap = {}

    meshes = []

    getBufferGeometryHelper(material) {
        const key = material.uuid
        if (!this.bufferHelperMap[key]) {
            this.bufferHelperMap[key] = new BufferGeometryHelper(material)
        }
        return this.bufferHelperMap[key]
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