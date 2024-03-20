import Mapblock from "./Mapblock.js"

export default class {
    constructor(mapblockloader) {
        this.mapblockloader = mapblockloader
    }

    load(mbpos) {
        this.mapblockloader(mbpos)
        .then(mapblock_def => {
            const mb = new Mapblock(mapblock_def)
            console.log(mb)
        })
    }
}