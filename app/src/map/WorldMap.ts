import { Manifest } from "../types/Manifest";

export class WorldMap {
    constructor(private baseurl: string){}

    load() {
        fetch(`${this.baseurl}/manifest.json`)
        .then(r => r.json())
        .then(b => b as Manifest)
        .then(m => {
            // TODO
        })
    }
}