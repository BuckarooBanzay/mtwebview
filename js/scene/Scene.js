import { Color, PerspectiveCamera, Scene, WebGLRenderer, AmbientLight, Vector3, Clock } from "three";
import { FirstPersonControls } from 'three/examples/jsm/controls/FirstPersonControls.js';

export default class {

    clock = new Clock()
    scene = new Scene()
    camera = new PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000)
    active = true;

    constructor(el) {
        this.scene.background = new Color(1,1,1)

        this.renderer = new WebGLRenderer({ canvas: el })
        this.renderer.setSize(window.innerWidth, window.innerHeight)

        this.camera.position.x = 30
        this.camera.position.y = -30
        this.camera.position.z = -30
        this.camera.lookAt(new Vector3(0, 0, 0));

        this.controls = new FirstPersonControls(this.camera, el)
        this.controls.lookSpeed = 0.4;
        this.controls.movementSpeed = 20;
        this.controls.noFly = true;
        this.controls.lookVertical = true;
        this.controls.constrainVertical = true;
        this.controls.verticalMin = 1.0;
        this.controls.verticalMax = 2.0;
        this.controls.lon = -150;
        this.controls.lat = 120;

        this.scene.add(new AmbientLight(0xffffff));

        //this.controls.addEventListener( 'change', () => this.render() );

        this.animate()
    }

    animate() {
        this.controls.update(this.clock.getDelta())
        this.renderer.render(this.scene, this.camera)
        console.log(`Calls: ${this.renderer.info.render.calls}, Triangles: ${this.renderer.info.render.triangles}`)
        window.requestAnimationFrame(() => this.animate())
    }

    render() {
        if (!this.active) {
            return
        }
    }

    addMesh(m) {
        this.scene.add(m)
        this.render()
    }

    remove() {
        this.active = false
        this.renderer.dispose()
    }

}