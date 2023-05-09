import { Mesh } from "three";
import { WorldMap } from "../../map/WorldMap";
import { Pos } from "../../util/Pos";
import { MaterialManager } from "../MaterialManager";
import { DrawType } from "./drawtype/DrawType";
import { NormalDrawType } from "./drawtype/NormalDrawType";

export class MeshGenerator {
    constructor(nodedefs: Map<string, NodeDefinition>, worldmap: WorldMap, matmgr: MaterialManager) {
        const ndt = new NormalDrawType()
        ndt.init(nodedefs, worldmap, matmgr)
        this.registerDrawType(ndt)
    }
    
    drawtypes = new Map<string, DrawType>()

    registerDrawType(dt: DrawType) {
        this.drawtypes.set(dt.getDrawType(), dt)
    }

    createMesh(from: Pos, to: Pos): Mesh|null {
        const m = new Mesh()
        this.drawtypes.forEach(dt => {
            const nm = dt.createMesh(from, to)
            if (nm) {
                m.add(nm)
            }
        })
        return m
    }

}