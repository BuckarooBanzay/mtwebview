import { NormalDrawType } from "./NormalDrawType";

export class GlasslikeDrawType extends NormalDrawType {
    isNodedefOccluding(ndef: NodeDefinition): boolean {
        return ndef.drawtype == "normal" || ndef.drawtype == "glasslike"
    }
}