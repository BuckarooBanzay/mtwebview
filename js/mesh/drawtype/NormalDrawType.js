import { SideDirs } from "../../util/SideDirs.js";
import { FrontSide, Material, Side } from "three";

export default class {

    init(worldmap, matcache) {
        this.nodedefs = nodedefs
        this.worldmap = worldmap
        this.matcache = matcache

        nodedefs
        .forEach(ndef => {
            if (this.isNodedefOccluding(ndef)) {
                this.occludingNodeIDs.set(ndef.id, true)
            }
        })

        return this.createMaterials()
    }

    getTextureDef(tiles, side) {
        const fallback = tiles[tiles.length-1]
        switch (side) {
            case NodeSide.YP:
                return tiles[0]
            case NodeSide.YN:
                return tiles[1] || fallback
            case NodeSide.XP:
                return tiles[2] || fallback
            case NodeSide.XN:
                return tiles[3] || fallback
            case NodeSide.ZP:
                return tiles[4] || fallback
            case NodeSide.ZN:
                return tiles[5] || fallback
                                                    
        }
    }

    createMaterial(tiledef: string, transparent: boolean, drawside: Side): Promise<any> {
        if (!tiledef) {
            return Promise.resolve()
        }
        return this.matcache.generate({DrawSide: drawside, TextureDef: tiledef, Transparent: transparent})
    }

    createMaterials(): Promise<any> {
        const promises = new Array<Promise<any>>()
        this.nodedefs.forEach(ndef => {
            if (ndef.drawtype == "normal") {
                promises.push(this.createMaterial(ndef.tiles[0].name, false, FrontSide))
                promises.push(this.createMaterial(ndef.tiles[1].name, false, FrontSide))
                promises.push(this.createMaterial(ndef.tiles[2].name, false, FrontSide))
                promises.push(this.createMaterial(ndef.tiles[3].name, false, FrontSide))
                promises.push(this.createMaterial(ndef.tiles[4].name, false, FrontSide))
                promises.push(this.createMaterial(ndef.tiles[5].name, false, FrontSide))
            }
        })

        return Promise.all(promises)
    }

    occludingNodeIDs = new Map<number, boolean>()

    isNodedefOccluding(ndef: NodeDefinition): boolean {
        return ndef.drawtype == "normal"
    }

    isTransparent(pos: Pos): boolean {
        const node = this.worldmap.getNode(pos)
        if (node == null) {
            return false
        }

        return this.occludingNodeIDs.get(node.id) == undefined
    }

    getMaterial(nodedef: NodeDefinition, side: NodeSide): Material|undefined {
        const textureDef = this.getTextureDef(nodedef.tiles, side)
        return this.matcache.getMaterial({ DrawSide: FrontSide, TextureDef: textureDef.name, Transparent: false})
    }

    render(ctx: RenderContext, pos: Pos, node: MapNode, side: NodeSide): void {
        const neighbor_dir = SideDirs[side]
        const neighbor_pos = pos.add(neighbor_dir)

        if (!this.isTransparent(neighbor_pos)){
            return
        }

        const nodedef = this.nodedefs.get(node.name)
        if (!nodedef) {
            return
        }
        
        const m = this.getMaterial(nodedef, side)
        if (!m){
            return
        }

        const neighbor_node = this.worldmap.getNode(neighbor_pos)
        let light = 1
        if (neighbor_node){
            //TODO: proper light calc
            light = (neighbor_node.param1 & 0x0F) / 15
        }

        const bg = ctx.getGeometryHelper(m)
        bg.createNodeMeshSide(pos, side, light)
    }
}