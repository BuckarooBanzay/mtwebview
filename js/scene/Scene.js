import { Color, PerspectiveCamera, Scene, WebGLRenderer, AmbientLight, Vector3, Clock } from "three";
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';

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

        this.controls = new PointerLockControls(this.camera, el)

        this.moveForward = false;
        this.moveBackward = false;
        this.moveLeft = false;
        this.moveRight = false;
        this.moveUp = false;
        this.moveDown = false;

        this.velocity = new Vector3();
        this.direction = new Vector3();

        el.addEventListener('click',  () => this.controls.lock());
        this.scene.add( this.controls.object );

        const onKeyDown = event => {
            switch ( event.code ) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = true;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = true;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = true;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = true;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.moveDown = true;
                    break;
                case 'Space':
                    this.moveUp = true;
                    break;
            }
        };

        const onKeyUp = event => {
            switch (event.code) {
                case 'ArrowUp':
                case 'KeyW':
                    this.moveForward = false;
                    break;
                case 'ArrowLeft':
                case 'KeyA':
                    this.moveLeft = false;
                    break;
                case 'ArrowDown':
                case 'KeyS':
                    this.moveBackward = false;
                    break;
                case 'ArrowRight':
                case 'KeyD':
                    this.moveRight = false;
                    break;
                case 'ShiftLeft':
                case 'ShiftRight':
                    this.moveDown = false;
                    break;
                case 'Space':
                    this.moveUp = false;
                    break;
            }
        };

        document.addEventListener( 'keydown', onKeyDown );
        document.addEventListener( 'keyup', onKeyUp );

        this.scene.add(new AmbientLight(0xffffff));

        this.controls.addEventListener('change', () => console.log("change") );

        this.animate()
    }

    animate() {
        if (this.controls.isLocked) {

            console.log( this.controls.object.position );

            const delta = this.clock.getDelta();

            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.y -= this.velocity.y * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;

            this.direction.z = Number( this.moveForward ) - Number( this.moveBackward );
            this.direction.y = Number( this.moveUp ) - Number( this.moveDown );
            this.direction.x = Number( this.moveRight ) - Number( this.moveLeft );
            this.direction.normalize(); // this ensures consistent movements in all directions

            if ( this.moveForward || this.moveBackward ) {
                this.velocity.z -= this.direction.z * 400.0 * delta;
            }
            if (this.moveUp || this.moveDown) {
                this.velocity.y -= this.direction.y * 400.0 * delta;
            }
            if ( this.moveLeft || this.moveRight ) {
                this.velocity.x -= this.direction.x * 400.0 * delta;
            }

            this.controls.moveRight( - this.velocity.x * delta );
            this.controls.moveForward( - this.velocity.z * delta );
            this.controls.object.position.y -= ( this.velocity.y * delta );

        }

        //this.controls.update(this.clock.getDelta())
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