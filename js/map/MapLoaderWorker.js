import Pos from "../util/Pos.js"
import { BufferGeometry, BufferAttribute, Uint32BufferAttribute, Mesh } from 'three'
import { WebWorker } from "../worker/WebWorker.js"

export default class {
    constructor(scene, worldmap, meshgen, materialmgr, range) {
        this.scene = scene
        this.worldmap = worldmap
        this.meshgen = meshgen
        this.materialmgr = materialmgr
        this.range = range || 2

        this.worker = new WebWorker() //TODO: hardcoded
    }

    // group_area_key -> mesh
    loaded_areas = {}

    queue = []

    async start() {
        if (this.active) {
            return
        }
        this.active = true
        await this.worker.init()
        this.check_area()
        this.checkQueue()
    }

    async checkQueue() {
        const group_area = this.queue.shift()
        if (group_area) {
            console.log("Rendering map area", group_area)
            const bundle = await this.worker.render_geometries(group_area.mb_pos1, group_area.mb_pos2)

            const meshgroup = new Mesh()
            const promises = bundle.map(async entry => {
                const material = await this.materialmgr.createMaterial(entry.material_def)

                const geo = new BufferGeometry()
                geo.setIndex(new Uint32BufferAttribute(entry.geometry.index, 1))
                geo.setAttribute('position', new BufferAttribute(new Float32Array(entry.geometry.position), 3));
                geo.setAttribute('uv', new BufferAttribute(new Float32Array(entry.geometry.uv), 2));
                geo.setAttribute('color', new BufferAttribute(new Float32Array(entry.geometry.color), 3));
                geo.computeBoundingBox()

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
        const mb_pos1 = mb_pos.add(new Pos(-range,-range,-range))
        const mb_pos2 = mb_pos.add(new Pos(range,range,range))
        const key = `${mb_pos1.x}/${mb_pos1.y}/${mb_pos1.z}/${mb_pos2.x}/${mb_pos2.y}/${mb_pos2.z}`
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