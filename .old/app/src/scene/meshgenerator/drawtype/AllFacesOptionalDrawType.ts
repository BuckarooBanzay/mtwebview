import { DoubleSide, Material } from "three";
import { NodeSide } from "../../../types/NodeSide";
import { NormalDrawType } from "./NormalDrawType";

export class AllFacesOptionalDrawType extends NormalDrawType {
    createMaterials(): Promise<any> {
        const promises = new Array<Promise<any>>()
        this.nodedefs.forEach(ndef => {
            if (ndef.drawtype == "allfaces_optional") {
                promises.push(this.createMaterial(ndef.tiles[0].name, true, DoubleSide))
                promises.push(this.createMaterial(ndef.tiles[1].name, true, DoubleSide))
                promises.push(this.createMaterial(ndef.tiles[2].name, true, DoubleSide))
                promises.push(this.createMaterial(ndef.tiles[3].name, true, DoubleSide))
                promises.push(this.createMaterial(ndef.tiles[4].name, true, DoubleSide))
                promises.push(this.createMaterial(ndef.tiles[5].name, true, DoubleSide))
            }
        })

        return Promise.all(promises)
    }

    getMaterial(nodedef: NodeDefinition, side: NodeSide): Material|undefined {
        const textureDef = this.getTextureDef(nodedef.tiles, side)
        return this.matcache.getMaterial({ DrawSide: DoubleSide, TextureDef: textureDef.name, Transparent: false})
    }
}