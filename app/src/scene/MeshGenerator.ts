import { Mesh } from "three";
import { WorldMap } from "../map/WorldMap";
import { Pos } from "../util/Pos";
import { MaterialManager } from "./MaterialManager";

export class MeshGenerator {
    constructor(worldmap: WorldMap, nodedefs: Map<string, NodeDefinition>, matmgr: MaterialManager) {}

    createMesh(pos: Pos): Mesh {
        const m = new Mesh()
        //TODO

        return m
    }

}