import { MeshBasicMaterial, Color, FrontSide } from "three";

import RenderContext from "./RenderContext.js"
import Pos from "../util/Pos.js"
import NodeSide from "../util/NodeSide.js"

const sidelist = Object.keys(NodeSide)

export default class PlainMeshGenerator {

    constructor(worldmap, colormapping) {
        this.worldmap = worldmap
        this.colormapping = colormapping
    }

    materials = {}

    getMaterial(color) {
        const key = `${color.R}/${color.G}/${color.B}/${color.A}`
        if (!this.materials[key]) {
            const c = new Color().setRGB( color.R/255, color.G/255, color.B/255 );
            this.materials[key] = new MeshBasicMaterial({
                color: c,
                side: FrontSide,
                vertexColors: true,
            })
        }

        return this.materials[key]
    }

    render(ctx, pos, material) {
        for (let i=0; i<sidelist.length; i++) {
            const sidename = sidelist[i]
            const side = NodeSide[sidename]
            const neighbor_pos = pos.add(side.dir)

            const neighbor_node = this.worldmap.getNode(neighbor_pos)
            if (neighbor_node.name == "ignore") {
                // side not visible
                continue
            }

            const neighbor_color = this.colormapping[neighbor_node.name]
            if (neighbor_color) {
                // side not visible
                continue
            }
            
            const light = (neighbor_node.param1 & 0x0F) / 15
            let c = new Color(light, light, light)

            const gh = ctx.getBufferGeometryHelper(material)
            gh.addCubeSide(pos, side, c)
        }
    }

    async createMesh(pos1, pos2) {
        const ctx = new RenderContext()

        for (let z=pos1.z; z<pos2.z; z++) {
            for (let y=pos1.y; y<pos2.y; y++) {
                for (let x=pos1.x; x<pos2.x; x++) {
                    const pos = new Pos(x,y,z)
                    const node = this.worldmap.getNode(pos)
                    if (!node) {
                        continue
                    }
                    
                    const color = this.colormapping[node.name]
                    if (!color) {
                        continue
                    }

                    const material = this.getMaterial(color)
                    this.render(ctx, pos, material)
                }
            }
        }

        return ctx.toMesh()
    }
}