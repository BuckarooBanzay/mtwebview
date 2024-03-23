
export class MapNode {
    constructor(
        public id: number,
        public name: string,
        public param1: number,
        public param2: number) {

        }
    
    equals(other: MapNode): boolean {
        return (
            this.id == other.id &&
            this.param1 == other.param1 &&
            this.param1 == other.param1
        )
    }

}