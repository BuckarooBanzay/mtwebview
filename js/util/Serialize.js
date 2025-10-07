import { BufferGeometry, BufferAttribute, Uint32BufferAttribute } from 'three'

export function serializeBufferGeometry(geo) {
    return {
        index: geo.getIndex().array,
        position: geo.getAttribute("position").array,
        uv: geo.getAttribute("uv").array,
        color: geo.getAttribute("color").array
    }
}

export function deserializeBufferGeometry(obj) {
    const geo = new BufferGeometry()
    geo.setIndex(new Uint32BufferAttribute(obj.index, 1))
    geo.setAttribute('position', new BufferAttribute(new Float32Array(obj.position), 3));
    geo.setAttribute('uv', new BufferAttribute(new Float32Array(obj.uv), 2));
    geo.setAttribute('color', new BufferAttribute(new Float32Array(obj.color), 3));
    geo.computeBoundingBox()
    return geo
}