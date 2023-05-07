import { Scene } from "./scene/Scene"

const e = document.getElementById("scene") as HTMLCanvasElement
const scene = new Scene(e)
scene.animate()
console.log(e)
