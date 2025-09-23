import { decompressSync } from 'fflate'
import { decompress } from "fzstd"

const textDecoder = new TextDecoder()

function parseGzMapblock(buf, version) {
    const mapblock = {
        node_mapping: {}
    }

    let offset = 6
    if (version < 27) {
        //u16 lighting_complete not present
        offset = 4
    }

    const compressedData = new Uint8Array(buf.slice(offset))
    mapblock.mapdata = decompressSync(compressedData)

    // TODO: search for end of gzipped data somehow (decompressSync does not expose that)
    // TODO: parse.go in mapparser project
    const a = new Uint8Array(buf)
    console.log(a)

    return mapblock
}

function parseZstdMapblock(buf) {
    const mapblock = {
        node_mapping: {}
    }

    const compressedData = new Uint8Array(buf.slice(1))
    const uncompressedData = decompress(compressedData)
    console.log(uncompressedData)

    const dv = new DataView(uncompressedData.buffer)
    let offset = 8

    const numMappings = dv.getUint16(offset)
    offset += 2

    for (let i=0; i<numMappings; i++) {
        const nodeId = dv.getUint16(offset)
        offset += 2
        const nameLen = dv.getUint16(offset)
        offset += 2
        const name = textDecoder.decode(uncompressedData.slice(offset, offset+nameLen))
        offset += nameLen
        mapblock.node_mapping[name] = nodeId
    }

    offset += 2 // content width * 2

    mapblock.mapdata = uncompressedData.slice(offset, offset + (4096 * 4))
    return mapblock
}

// parse a raw mapblock in the database format
export function parseRawMapblock(buffer) {
    const dv = new DataView(buffer)
    const version = dv.getUint8(0)

    if (version > 25 && version  < 29) {
        return parseGzMapblock(buffer, version)
    } else if(version == 29) {
        return parseZstdMapblock(buffer)
    } else {
        throw new Error("invalid mapblock version: " + version)
    }
}

function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// helper for base64 encoded gzipped "bare" mapblock data
export function parseBase64GzMapblock(str) {
    const buf = base64ToArrayBuffer(str)
    const decompressed = decompressSync(new Uint8Array(buf))
    return decompressed.buffer
}