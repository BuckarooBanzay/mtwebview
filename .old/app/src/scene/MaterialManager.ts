import { Material, MeshBasicMaterial, NearestFilter, RepeatWrapping, Side, TextureLoader } from "three";
import { MediaManager } from "../media/MediaManager";
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

const loader = new TextureLoader()

export class MaterialManager {
    constructor(public ndefs: Map<string, NodeDefinition>, public mm: MediaManager, private wireframe: boolean) {}

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

    createMaterial(tiledef: string, transparent: boolean, drawside: Side): Promise<Material> {
        return this.createImage(tiledef)
        .then(img => {
            const texture = loader.load(img.toDataURL())
            texture.magFilter = NearestFilter
            texture.wrapS = RepeatWrapping
            texture.wrapT = RepeatWrapping
            
            return new MeshBasicMaterial({
                map: texture,
                vertexColors: true,
                wireframe: this.wireframe,
                side: drawside,
                transparent: transparent,
            })
        })
    }

}