import { Color, PerspectiveCamera, Scene, WebGLRenderer, BoxGeometry, MeshBasicMaterial, Mesh } from "three";
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

        // "debug" box
        const geometry = new BoxGeometry( 1, 1, 1 );
        const material = new MeshBasicMaterial( { color: 0x00ff00 } );
        const cube = new Mesh( geometry, material );
        this.scene.add( cube );

        setInterval(() => {
            console.log(`Calls: ${this.renderer.info.render.calls}, Triangles: ${this.renderer.info.render.triangles}`)
        }, 1000)
    }

    animate() {
        this.stats.begin()
        this.renderer.render(this.scene, this.camera)
        this.stats.end()

        this.controls.update()
        window.requestAnimationFrame(() => this.animate())
    }

    addMesh(m) {
        this.scene.add(m)
    }

}