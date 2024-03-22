

export default function(tiledef) {
    let str = tiledef
    if (typeof(tiledef) == "object") {
        if (tiledef.name) {
            str = tiledef.name
        } else {
            // not sure what to do here
            return []
        }
    }
    const parts = str.split("^")

    return parts
    .filter(p => p.length > 0)
    .map(p => {
        if (p[0] != "[") {
            // plain image
            return { image: p }
        } else {
            // operator
            return { op: p.substring(1) }
        }
    });
}