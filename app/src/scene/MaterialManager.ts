import { DoubleSide, FrontSide, Material, MeshBasicMaterial, NearestFilter, RepeatWrapping, TextureLoader } from "three";
import { MediaManager } from "../media/MediaManager";
import { NodeSide } from "../types/NodeSide";
import { UnknownNodePNG } from "./builtin";
import { Image } from 'image-js'

const unknownNodeBlob = new Blob([Uint8Array.from(UnknownNodePNG)], {type: "octet/stream"})

function combineImages(base: Image, overlay: Image): Image {
    if (base.width != overlay.width || base.height != overlay.height) {
        // resize base
        base = base.resize({ height: overlay.height, width: overlay.width })
    }

    const buf = new Image({ width: base.width, height: base.height })

    for (let i=0; i<base.size; i++) {
        const p = base.getPixel(i)
        buf.setPixel(i, p)

        const c = overlay.getPixel(i)
        if (c[3] == 255) {
            // opaque
            buf.setPixel(i, c)
        } else if (c[3] > 0) {
            // semi transparent
            // TODO: proper calculation
            const f = 1 - (c[3] / 255)
            buf.setPixel(i, [
                p[0] - f,
                p[1] * f,
                p[2] * f,
                255
            ])
        }
    }

    return buf
}

export class MaterialManager {
    constructor(public ndefs: Map<string, NodeDefinition>, public mm: MediaManager, private wireframe: boolean) {}

    cache = new Map<string, Material>()

    getCacheString(nodename: string, side: NodeSide): string {
        return `${nodename}/${side}`
    }

    createImage(tiledef: string): Promise<Image> {
        // TODO: support (groups)
        let tidx = tiledef.indexOf("^")
        if (tidx < 0) {
            // only one part
            tidx = tiledef.length
        }
        const part = tiledef.substring(0, tidx)
        const rest = tiledef.substring(tidx+1)

        if (part.length <= 0 || part[0] == '[') {
            // can't render that (yet)
            return Image.load(Uint8Array.from(UnknownNodePNG))
        }

        var base_img: Image

        // load plain image from url
        return this.mm.getMedia(part)
        .then(blob => blob ? blob : unknownNodeBlob)
        .then(blob => blob.arrayBuffer())
        .then(ab => Image.load(ab))
        .then(img => base_img = img)
        .then(() => {
            if (rest.length) {
                // combine rest of the tiledef string
                return this.createImage(rest)
                .then(img => combineImages(base_img, img))
            } else {
                // just the base-image
                return base_img
            }
        })
    }

    createTexture(ndef: NodeDefinition, tiledef: TileDefinition, side: NodeSide): Promise<void> {
        if (!tiledef.name) {
            return Promise.resolve()
        }

        const key = this.getCacheString(ndef.name, side)
        if (this.cache.has(key)) {
            return Promise.resolve()
        }

        return this.createImage(tiledef.name)
        .then(img => {
            const loader = new TextureLoader()
            const texture = loader.load(img.toDataURL())
            texture.magFilter = NearestFilter
            texture.wrapS = RepeatWrapping
            texture.wrapT = RepeatWrapping
            
            const material = new MeshBasicMaterial({
                map: texture,
                vertexColors: true,
                wireframe: this.wireframe,
                side: FrontSide,
                transparent: true
            })

            if (ndef.drawtype == "allfaces" || ndef.drawtype == "allfaces_optional") {
                material.side = DoubleSide
            }
            
            this.cache.set(key, material)
        })
    }

    load(): Promise<number> {
        const promises = new Array<Promise<void>>()
        this.ndefs.forEach(ndef => {
            promises.push(this.createTexture(ndef, ndef.tiles[0], NodeSide.YP))
            promises.push(this.createTexture(ndef, ndef.tiles[1], NodeSide.YN))
            promises.push(this.createTexture(ndef, ndef.tiles[2], NodeSide.XP))
            promises.push(this.createTexture(ndef, ndef.tiles[3], NodeSide.XN))
            promises.push(this.createTexture(ndef, ndef.tiles[4], NodeSide.ZP))
            promises.push(this.createTexture(ndef, ndef.tiles[5], NodeSide.ZN))
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