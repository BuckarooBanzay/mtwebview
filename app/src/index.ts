import { WorldMap } from "./map/WorldMap"
import { MediaManager } from "./media/MediaManager"
import { NodedefManager } from "./nodedefs/NodedefManager"
import { Scene } from "./scene/Scene"
import { MaterialManager } from "./scene/MaterialManager"

const e = document.getElementById("scene") as HTMLCanvasElement
const scene = new Scene(e)
scene.animate()

const mm = new MediaManager("export/textures")
const map = new WorldMap("export")
var matmgr: MaterialManager

const nodedefmgr = new NodedefManager("export/nodedefs.json")
nodedefmgr.load()
.then(count => console.log(`Loaded ${count} nodedefs`))
.then(() => {
    matmgr = new MaterialManager(nodedefmgr.nodedefmap, mm)
    return matmgr.load()
})
.then(n => console.log(`Created ${n} materials`))
.then(() => map.load())
.then(n => console.log(`Loaded ${n} mapblocks`))