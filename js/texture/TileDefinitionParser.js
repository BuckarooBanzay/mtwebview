

export default function(tiledef) {
    if (typeof(tiledef) != "string") {
        // non-string tiledef, ignore
        return []
    }
    const parts = tiledef.split("^")

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