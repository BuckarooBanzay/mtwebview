import Pos from "./util/Pos.js"

export default class {
    constructor(scene, worldmap, meshgen) {
        this.scene = scene
        this.worldmap = worldmap
        this.meshgen = meshgen
    }

    // group_area_key -> mesh
    loaded_areas = {}

    start() {
        if (this.active) {
            return
        }
        this.active = true
        this.worker()
    }

    getMapblockGroupArea(pos) {
        const range = 2
        const mb_pos = pos.toMapblockPos()
        const mb_pos1 = mb_pos.add(new Pos(-range,-range,-range))
        const mb_pos2 = mb_pos.add(new Pos(range,range,range))
        const key = `${mb_pos1.x}/${mb_pos1.y}/${mb_pos1.z}/${mb_pos2.x}/${mb_pos2.y}/${mb_pos2.z}`
        return {mb_pos1, mb_pos2, key}
    }

    async worker() {
        if (!this.active) {
            return
        }

        //TODO: unload far away area
        //TODO: unload old mapblocks

        const pos = this.scene.getPosition()
        const group_area = this.getMapblockGroupArea(pos)
        if (!this.loaded_areas[group_area.key]) {
            console.log("Rendering map area", group_area)
            await this.worldmap.loadMapblockArea(group_area.mb_pos1, group_area.mb_pos2)
            const mesh = await this.meshgen.createMesh(group_area.mb_pos1.getMinMapblockPos(), group_area.mb_pos2.getMaxMapblockPos())
            this.loaded_areas[group_area.key] = mesh
            this.scene.addMesh(mesh)
        }

        setTimeout(() => this.worker(), 200)
    }

    stop() {
        this.active = false
    }
}