import { WorldMap } from "./map/WorldMap"
import { MediaManager } from "./media/MediaManager"
import { NodedefManager } from "./nodedefs/NodedefManager"
import { Scene } from "./scene/Scene"

const e = document.getElementById("scene") as HTMLCanvasElement
const scene = new Scene(e)
scene.animate()

const mm = new MediaManager("export/textures")

const nodedefmgr = new NodedefManager("export/nodedefs.json")
nodedefmgr.load().then(count => console.log(`loaded ${count} nodedefs`))

const map = new WorldMap("export")
map.load()