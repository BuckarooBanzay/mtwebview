import { Color, PerspectiveCamera, Scene, WebGLRenderer, AxesHelper, AmbientLight } from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import Stats from 'three/examples/jsm/libs/stats.module.js'

export default class {

    scene = new Scene()
    camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)

    stats = new Stats()

    constructor(el) {
        el.parentElement.appendChild(this.stats.dom)
        this.scene.background = new Color(1,1,1)

        this.renderer = new WebGLRenderer({ canvas: el })
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        this.controls = new OrbitControls(this.camera, el)
        this.controls.listenToKeyEvents(document.body)
        this.controls.minDistance = 5
        this.controls.maxDistance = 500

        this.controls.target.x = 30
        this.controls.target.y = -30
        this.controls.target.z = -30

        const axesHelper = new AxesHelper( 5 );
        this.scene.add( axesHelper );

        this.scene.add(new AmbientLight(0xffffff));

        this.controls.addEventListener( 'change', () => this.render() );

        this.animate()
    }

    animate() {
        this.controls.update()
        window.requestAnimationFrame(() => this.animate())
    }

    render() {
        this.stats.begin()
        this.renderer.render(this.scene, this.camera)
        this.stats.end()
        console.log(`Calls: ${this.renderer.info.render.calls}, Triangles: ${this.renderer.info.render.triangles}`)
    }

    addMesh(m) {
        this.scene.add(m)
        this.render()
    }

}