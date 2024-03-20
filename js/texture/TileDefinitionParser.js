

export default function(tiledef) {
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