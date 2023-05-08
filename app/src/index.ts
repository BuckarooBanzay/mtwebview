import { WorldMap } from "./map/WorldMap"
import { MediaManager } from "./media/MediaManager"
import { NodedefManager } from "./nodedefs/NodedefManager"
import { Scene } from "./scene/Scene"
import { MaterialManager } from "./scene/MaterialManager"
import { MeshGenerator } from "./scene/meshgenerator/MeshGenerator"
import { Pos } from "./util/Pos"

const e = document.getElementById("scene") as HTMLCanvasElement
const scene = new Scene(e)
scene.animate()

const BS = new Pos(16, 16, 16)

const mm = new MediaManager("export/textures")
const map = new WorldMap("export")
var matmgr: MaterialManager
var meshgen: MeshGenerator

const nodedefmgr = new NodedefManager("export/nodedefs.json")
nodedefmgr.load()
.then(count => console.log(`Loaded ${count} nodedefs`))
.then(() => {
    matmgr = new MaterialManager(nodedefmgr.nodedefmap, mm, false)
    return matmgr.load()
})
.then(n => console.log(`Created ${n} materials`))
.then(() => map.load())
.then(n => console.log(`Loaded ${n} mapblocks`))
.then(() => {
    meshgen = new MeshGenerator(map, nodedefmgr.nodedefmap, matmgr)

    const max_pos = map.max_block_pos.copy()
    max_pos.multiply(BS)
    max_pos.add(BS)

    const min_pos = map.min_block_pos.copy()
    min_pos.multiply(BS)

    console.log(`Creating mesh from: ${min_pos} to ${max_pos}`)
    const start = Date.now()
    let m = meshgen.createMesh(min_pos, max_pos)
    if (m) {
        scene.addMesh(m)
    }
    const diff = Date.now() - start
    console.log(`Mesh generated in ${diff} ms`)
})