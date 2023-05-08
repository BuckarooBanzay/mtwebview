import { DrawType } from "./DrawType";

export class NormalDrawType implements DrawType {
    getDrawType(): string {
        return "normal"
    }
}