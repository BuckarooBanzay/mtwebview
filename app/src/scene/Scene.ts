import { Color, Mesh, PerspectiveCamera, Scene as ThreeScene, WebGLRenderer } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import Stats from 'three/examples/jsm/libs/stats.module'

export class Scene {

    scene = new ThreeScene()
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    controls: OrbitControls
    renderer: WebGLRenderer
    stats = new Stats()

    constructor(e: HTMLCanvasElement) {
        e.parentElement?.appendChild(this.stats.dom)
        this.scene.background = new Color(1,1,1)

        this.renderer = new WebGLRenderer({ canvas: e })
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        this.controls = new OrbitControls(this.camera, e)
        this.controls.listenToKeyEvents(document.body)
        this.controls.minDistance = 5
        this.controls.maxDistance = 500
    }

    animate() {
        this.stats.begin()
        this.renderer.render(this.scene, this.camera)
        this.stats.end()

        this.controls.update()
        window.requestAnimationFrame(() => this.animate())
    }

    addMesh(m: Mesh) {
        this.scene.add(m)
    }
}