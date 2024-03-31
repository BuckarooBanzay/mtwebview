import { Mesh } from 'three';
import GeometryHelper from './GeometryHelper.js'

export default class {

    // material.uuid -> GeometryHelper
    helperMap = {}
    materialMap = {}
    meshes = []

    getGeometryHelper(material) {
        if (!this.helperMap[material.uuid]) {
            this.helperMap[material.uuid] = new GeometryHelper(material);
            this.materialMap[material.uuid] = material
        }
        return this.helperMap[material.uuid]
    }

    addMesh(m) {
        this.meshes.push(m)
    }

    toMesh() {
        const meshgroup = new Mesh()
        Object.keys(this.helperMap).forEach(uuid => {
            const gh = this.helperMap[uuid]
            const mesh = gh.createMesh()
            if (mesh) {
                meshgroup.add(mesh)
            }
        })
        this.meshes.forEach(mesh => meshgroup.add(mesh))
        return meshgroup
    }
}