import { Mesh } from "three";
import { WorldMap } from "../../map/WorldMap";
import { Pos } from "../../util/Pos";
import { MaterialManager } from "../MaterialManager";
import { DrawType } from "./drawtype/DrawType";
import { RenderContext } from "./RenderContext";
import { NormalDrawType } from "./drawtype/NormalDrawType";
import { NodeSide } from "../../types/NodeSide";
import { AllFacesOptionalDrawType } from "./drawtype/AllFacesOptionalDrawType";
import { GlasslikeDrawType } from "./drawtype/GlasslikeDrawType";
import { MaterialCache } from "../MaterialCache";

export class MeshGenerator {
    constructor(private nodedefs: Map<string, NodeDefinition>, private worldmap: WorldMap, private matmgr: MaterialManager) {
        this.drawtypes.set("normal", new NormalDrawType())
        this.drawtypes.set("allfaces_optional", new AllFacesOptionalDrawType())
        this.drawtypes.set("glasslike", new GlasslikeDrawType())
        this.drawtypes.set("glasslike_framed_optional", new GlasslikeDrawType())
    }

    init(): Promise<any> {
        const promises = new Array<Promise<void>>()
        const matcache = new MaterialCache(this.matmgr)
        // initialize all
        this.drawtypes.forEach(dt => {
            promises.push(dt.init(this.nodedefs, this.worldmap, matcache))
        })

        return Promise.all(promises)
    }
    
    drawtypes = new Map<string, DrawType>()

    createMesh(from: Pos, to: Pos): Mesh|null {
        const ctx = new RenderContext()

        for (let z=from.z; z<to.z; z++) {
            for (let y=from.y; y<to.y; y++) {
                for (let n=0; n<6; n++){
                    const side = n as NodeSide

                    for (let x=from.x; x<to.x; x++) {
                        const pos = new Pos(x,y,z)
                        const node = this.worldmap.getNode(pos)
                        if (!node) {
                            continue
                        }
                        
                        const ndef = this.nodedefs.get(node.name)
                        if (!ndef) {
                            continue
                        }

                        const dt = this.drawtypes.get(ndef.drawtype)
                        if (!dt) {
                            continue
                        }

                        dt.render(ctx, pos, node, side)
                    }
                }
            }
        }

        return ctx.toMesh()
    }

}