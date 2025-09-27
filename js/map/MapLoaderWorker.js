import Pos from "../util/Pos.js"
import { ObjectLoader } from "three"

export default class {
    constructor(scene, worldmap, meshgen, range) {
        this.scene = scene
        this.worldmap = worldmap
        this.meshgen = meshgen
        this.range = range || 2
        this.loader = new ObjectLoader();

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
            case "mesh":
                var obj = this.loader.parse(e.data.mesh)
                console.log("parsed object", obj)
                this.scene.addMesh(obj)
                this.loaded_areas[e.data.key] = obj

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