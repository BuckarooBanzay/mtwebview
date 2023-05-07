import { FrontSide, Material, MeshBasicMaterial, NearestFilter, RepeatWrapping, Texture, TextureLoader } from "three";
import { MediaManager } from "../media/MediaManager";
import { NodeSide } from "../types/NodeSide";
import { UnknownNodePNG } from "./builtin";


function blobToDataURL(blob: Blob): Promise<string> {
    return new Promise<string>(resolve => {
        const reader = new FileReader()
        reader.readAsDataURL(blob)
        reader.onloadend = () => resolve(reader.result as string)
    })
}

export class MaterialManager {
    constructor(public ndefs: Map<string, NodeDefinition>, public mm: MediaManager) {}

    cache = new Map<string, Material>()

    getCacheString(nodename: string, side: NodeSide): string {
        return `${nodename}/${side}`
    }

    createTexture(nodename: string, tiledef: string, side: NodeSide): Promise<void> {
        //TODO: proper tiledef parser
        const parts = tiledef.split("^")
        const key = this.getCacheString(nodename, side)

        return this.mm.getMedia(parts[0])
        .then(blob => blob ? blob : new Blob([Uint8Array.from(UnknownNodePNG)], {type: "octet/stream"}))
        .then(blob => blobToDataURL(blob!))
        .then(url => {
            const loader = new TextureLoader()
            const texture = loader.load(url)
            texture.magFilter = NearestFilter
            texture.wrapS = RepeatWrapping
            texture.wrapT = RepeatWrapping
            
            const material = new MeshBasicMaterial({
                map: texture,
                vertexColors: true,
                wireframe: false,
                side: FrontSide
            })
            
            this.cache.set(key, material)
        })
    }

    load(): Promise<number> {
        const promises = new Array<Promise<void>>()
        this.ndefs.forEach(ndef => {
            promises.push(this.createTexture(ndef.name, ndef.tiles[0].name, NodeSide.YP))
            promises.push(this.createTexture(ndef.name, ndef.tiles[1].name, NodeSide.YN))
            promises.push(this.createTexture(ndef.name, ndef.tiles[2].name, NodeSide.XP))
            promises.push(this.createTexture(ndef.name, ndef.tiles[3].name, NodeSide.XN))
            promises.push(this.createTexture(ndef.name, ndef.tiles[4].name, NodeSide.ZP))
            promises.push(this.createTexture(ndef.name, ndef.tiles[5].name, NodeSide.ZN))
        })

        return Promise.all(promises)
        .then(() => this.cache.size)
    }

    getMaterial(nodename: string, side: NodeSide) : Material|null {
        const key = this.getCacheString(nodename, side)
        const t = this.cache.get(key)
        return t == undefined ? null : t
    }
}