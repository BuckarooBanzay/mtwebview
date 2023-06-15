import { FrontSide, Material } from "three";
import { NodeSide } from "../../../types/NodeSide";
import { NormalDrawType } from "./NormalDrawType";

export class GlasslikeDrawType extends NormalDrawType {
    isNodedefOccluding(ndef: NodeDefinition): boolean {
        return ndef.drawtype == "normal" || ndef.drawtype == "glasslike" || ndef.drawtype == "glasslike_framed" || ndef.drawtype == "glasslike_framed_optional"
    }

    createMaterials(): Promise<any> {
        const promises = new Array<Promise<any>>()
        this.nodedefs.forEach(ndef => {
            if (ndef.drawtype == "glasslike" || ndef.drawtype == "glasslike_framed" || ndef.drawtype == "glasslike_framed_optional") {
                const tiledef = ndef.tiles[0].name + "^" + ndef.tiles[1].name
                promises.push(this.createMaterial(tiledef, true, FrontSide))
            }
        })

        return Promise.all(promises)
    }

    getMaterial(nodedef: NodeDefinition, side: NodeSide): Material|undefined {
        const textureDef = nodedef.tiles[0].name + "^" + nodedef.tiles[1].name
        return this.matcache.getMaterial({ DrawSide: FrontSide, TextureDef: textureDef, Transparent: true})
    }
}