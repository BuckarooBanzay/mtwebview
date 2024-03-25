import { Vector3 } from "three";
import Base from "./Base.js";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export default class extends Base {

    // name -> mesh
    meshCache = {}

    loader = new OBJLoader()

    getMesh(name) {
        if (this.meshCache[name]) {
            return Promise.resolve(this.meshCache[name])
        }

        return this.mediasource(name).then(url => {
            return new Promise(resolve => {
                this.loader.load(url, obj => {
                    this.meshCache[name] = obj;
                    resolve(obj);
                })
            })
        })
    }

    async render(ctx, pos, node, nodedef) {
        console.log(pos, node.name, nodedef.mesh)

        if (!nodedef.mesh || !nodedef.mesh.endsWith(".obj")) {
            return
        }

        const mesh = await this.getMesh(nodedef.mesh)
        mesh.translateX(1)
        /*
        mesh.translateX(pos.x * -1)
        mesh.translateY(pos.y)
        mesh.translateZ(pos.z)
        */
        ctx.addMesh(mesh)
    }
}