import { Mesh } from "three";
import { WorldMap } from "../../map/WorldMap";
import { Pos } from "../../util/Pos";
import { MaterialManager } from "../MaterialManager";
import { DrawType, RenderContext } from "./drawtype/DrawType";
import { NormalDrawType } from "./drawtype/NormalDrawType";
import { NodeSide } from "../../types/NodeSide";
import { AllFacesOptionalDrawType } from "./drawtype/AllFacesOptionalDrawType";

export class MeshGenerator {
    constructor(private nodedefs: Map<string, NodeDefinition>, private worldmap: WorldMap, private matmgr: MaterialManager) {
        this.drawtypes.set("normal", new NormalDrawType())
        this.drawtypes.set("allfaces_optional", new AllFacesOptionalDrawType())

        this.drawtypes.forEach(dt => {
            dt.init(nodedefs, worldmap, matmgr)
        })
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