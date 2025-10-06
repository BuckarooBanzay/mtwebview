import Pos from "../util/Pos.js"
import { BufferGeometry, BufferAttribute, Uint32BufferAttribute, Mesh } from 'three'

export default class {
    constructor(scene, worldmap, meshgen, materialmgr, range) {
        this.scene = scene
        this.worldmap = worldmap
        this.meshgen = meshgen
        this.materialmgr = materialmgr
        this.range = range || 2

        this.worker = new Worker("./js/bundle.js") //TODO: hardcoded
        this.worker.onmessage = e => this.onWorkerMessage(e)
        this.worker.postMessage({
            type: "init",
            config: {
                TODO: true
            }
        })
    }

    // group_area_key -> mesh
    loaded_areas = {}

    start() {
        if (this.active) {
            return
        }
        this.active = true
        this.check_area()
    }

    getMapblockGroupArea(pos) {
        const range = this.range
        const mb_pos = pos.toMapblockPos()
        const mb_pos1 = mb_pos.add(new Pos(-range,-range,-range))
        const mb_pos2 = mb_pos.add(new Pos(range,range,range))
        const key = `${mb_pos1.x}/${mb_pos1.y}/${mb_pos1.z}/${mb_pos2.x}/${mb_pos2.y}/${mb_pos2.z}`
        return {mb_pos1, mb_pos2, key}
    }

    onWorkerMessage(e) {
        console.log("got message from worker", e.data)
        switch (e.data.type) {
            case "bundle":
                var meshgroup = new Mesh()
                var promises = e.data.bundle.map(async entry => {
                    const material_def = entry.material_def
                    const material = await this.materialmgr.createMaterial(
                        material_def.texture,
                        material_def.transparent,
                        material_def.renderside,
                        true
                    )

                    const geo = new BufferGeometry()
                    geo.setIndex(new Uint32BufferAttribute(entry.geometry.index, 1))
                    geo.setAttribute('position', new BufferAttribute(new Float32Array(entry.geometry.position), 3));
                    geo.setAttribute('uv', new BufferAttribute(new Float32Array(entry.geometry.uv), 2));
                    geo.setAttribute('color', new BufferAttribute(new Float32Array(entry.geometry.color), 3));
                    geo.computeBoundingBox()

                    console.log("bundle", { geo, material })
                    const mesh = new Mesh(geo, material)                    
                    meshgroup.add(mesh)
                })

                Promise.all(promises).then(() => {
                    console.log("bundle done", { meshgroup })
                    this.scene.addMesh(meshgroup)
                    this.loaded_areas[e.data.key] = meshgroup
                })

        }
    }

    async check_area() {
        if (!this.active) {
            return
        }

        //TODO: unload far away area
        //TODO: unload old mapblocks
        setTimeout(() => this.check_area(), 100)

        const pos = this.scene.getPosition()
        const group_area = this.getMapblockGroupArea(pos)
        if (!this.loaded_areas[group_area.key]) {
            this.loaded_areas[group_area.key] = true // generating marker

            console.log("Rendering map area", group_area)
            this.worker.postMessage({
                type: "render",
                mb_pos1: group_area.mb_pos1,
                mb_pos2: group_area.mb_pos2,
                key: group_area.key
            })
        }
    }

    stop() {
        this.active = false
        this.worker.terminate()
    }
}