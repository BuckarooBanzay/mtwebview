import { decompressSync } from 'fflate';


function base64ToArrayBuffer(base64) {
    var binaryString = atob(base64);
    var bytes = new Uint8Array(binaryString.length);
    for (var i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

// decompresses a base64 encoded gzip-stream into a Buffer
export default function(str) {
    const buf = base64ToArrayBuffer(str)
    const decompressed = decompressSync(new Uint8Array(buf))
    return decompressed.buffer
}

// TODO: blockparser util (https://github.com/BuckarooBanzay/meseweb/blob/master/webapp/src/block/blockparser.ts)