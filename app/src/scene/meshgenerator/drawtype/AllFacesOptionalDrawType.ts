import { DoubleSide } from "three";
import { NodeSide } from "../../../types/NodeSide";
import { NormalDrawType } from "./NormalDrawType";

export class AllFacesOptionalDrawType extends NormalDrawType {
    createMaterials(): Promise<any> {
        const promises = new Array<Promise<any>>()
        this.nodedefs.forEach(ndef => {
            if (ndef.drawtype == "allfaces_optional") {
                promises.push(this.createMaterial(ndef, ndef.tiles[0].name, NodeSide.YP, true, DoubleSide))
                promises.push(this.createMaterial(ndef, ndef.tiles[1].name, NodeSide.YN, true, DoubleSide))
                promises.push(this.createMaterial(ndef, ndef.tiles[2].name, NodeSide.XP, true, DoubleSide))
                promises.push(this.createMaterial(ndef, ndef.tiles[3].name, NodeSide.XN, true, DoubleSide))
                promises.push(this.createMaterial(ndef, ndef.tiles[4].name, NodeSide.ZP, true, DoubleSide))
                promises.push(this.createMaterial(ndef, ndef.tiles[5].name, NodeSide.ZN, true, DoubleSide))
            }
        })

        return Promise.all(promises)
    }
}