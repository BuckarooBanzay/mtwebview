import { NormalDrawType } from "./NormalDrawType";

export class AllFacesOptionalDrawType extends NormalDrawType {
    getDrawType(): string {
        return "allfaces_optional"
    }
}