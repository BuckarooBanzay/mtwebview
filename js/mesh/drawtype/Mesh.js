import { FrontSide } from "three";
import Base from "./Base.js";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

export default class extends Base {

    // name -> mesh
    meshCache = {}


    async getMesh(name) {
        if (this.meshCache[name]) {
            return this.meshCache[name].clone()
        }

        const material = await this.matmgr.createMaterial("default_stone.png", false, FrontSide)
        const url = await this.mediasource(name)

        const loader = new OBJLoader()

        return await new Promise(resolve => {
            loader.load(url, obj => {
                console.log(obj.children[0])
                obj.children[0].material = material
                this.meshCache[name] = obj.children[0].clone();
                resolve(obj.children[0]);
            })
        })
    }

    async render(ctx, pos, node, nodedef) {
        console.log(pos, node.name, nodedef.mesh)

        if (!nodedef.mesh || !nodedef.mesh.endsWith(".obj")) {
            return
        }

        const mesh = await this.getMesh(nodedef.mesh)
        mesh.translateX(pos.x * -1)
        mesh.translateY(pos.y)
        mesh.translateZ(pos.z)

        ctx.addMesh(mesh)
    }
}