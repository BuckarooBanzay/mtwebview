import { FrontSide } from "three";
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import Base from "./Base.js";
import NodeSide from "../../util/NodeSide.js"

export default class extends Base {

    // name -> mesh
    meshCache = {}


    async getMesh(nodedef) {
        const nodename = nodedef.name
        if (this.meshCache[nodename]) {
            return this.meshCache[nodename].clone()
        }

        const materials = [
            await this.matmgr.createMaterial(this.getTextureDef(nodedef, NodeSide.YP), false, FrontSide, false),
            await this.matmgr.createMaterial(this.getTextureDef(nodedef, NodeSide.YN), false, FrontSide, false),
            await this.matmgr.createMaterial(this.getTextureDef(nodedef, NodeSide.XP), false, FrontSide, false),
            await this.matmgr.createMaterial(this.getTextureDef(nodedef, NodeSide.XN), false, FrontSide, false),
            await this.matmgr.createMaterial(this.getTextureDef(nodedef, NodeSide.ZP), false, FrontSide, false),
            await this.matmgr.createMaterial(this.getTextureDef(nodedef, NodeSide.ZN), false, FrontSide, false)
        ]
        const url = await this.mediasource(nodedef.mesh)

        const loader = new OBJLoader()

        return await new Promise(resolve => {
            loader.load(url, obj => {
                obj.children.forEach((child, i) => {
                    child.material = materials[i]
                })

                this.meshCache[nodename] = obj
                resolve(obj.clone());
            })
        })
    }

    async render(ctx, pos, node, nodedef) {
        if (!nodedef.mesh || !nodedef.mesh.endsWith(".obj")) {
            return
        }

        const mesh = await this.getMesh(nodedef)
        mesh.translateX(pos.x * -1)
        mesh.translateY(pos.y)
        mesh.translateZ(pos.z)

        ctx.addMesh(mesh)
    }
}