import Pos from "../util/Pos.js"
import { Mesh } from 'three'
import { deserializeBufferGeometry } from "../util/Serialize.js"

export default class {
    constructor(scene, materialmgr, worker, range) {
        this.scene = scene
        this.materialmgr = materialmgr
        this.worker = worker
        this.range = range || 2
    }

    // group_area_key -> mesh
    loaded_areas = {}

    queue = []

    async start() {
        if (this.active) {
            return
        }
        this.active = true
        this.check_area()
        this.checkQueue()
    }

    async checkQueue() {
        const group_area = this.queue.shift()
        if (group_area) {
            console.log("Rendering map area", group_area)
            const bundle = await this.worker.render_geometries(group_area.mb_pos1, group_area.mb_pos2)

            if (bundle.length == 0) {
                // nothing to render here
                return
            }

            const meshgroup = new Mesh()
            const promises = bundle.map(async entry => {
                const material = await this.materialmgr.createMaterial(entry.material_def)
                const geo = deserializeBufferGeometry(entry.geometry)

                const mesh = new Mesh(geo, material)
                meshgroup.add(mesh)
            })

            await Promise.all(promises)
            this.scene.addMesh(meshgroup)
            this.loaded_areas[group_area.key] = meshgroup
        }
        setTimeout(() => this.checkQueue(), 50)
    }

    getMapblockGroupArea(pos) {
        const range = this.range
        const mb_pos = pos.toMapblockPos()
        const chunk_origin_x = Math.floor(mb_pos.x / range)
        const chunk_origin_y = Math.floor(mb_pos.y / range)
        const chunk_origin_z = Math.floor(mb_pos.z / range)

        const mb_pos1 = mb_pos.add(new Pos(-range,-range,-range))
        const mb_pos2 = mb_pos.add(new Pos(range,range,range))
        const key = `${chunk_origin_x}/${chunk_origin_y}/${chunk_origin_z}`
        return {mb_pos1, mb_pos2, key}
    }

    async check_area() {
        if (!this.active) {
            return
        }

        //TODO: unload far away area
        //TODO: unload old mapblocks

        const pos = this.scene.getPosition()
        const group_area = this.getMapblockGroupArea(pos)
        
        if (!this.loaded_areas[group_area.key]) {
            this.loaded_areas[group_area.key] = true // generating marker
            this.queue.push(group_area)
        }

        setTimeout(() => this.check_area(), 100)
    }

    stop() {
        this.active = false
        this.worker.terminate()
    }
}