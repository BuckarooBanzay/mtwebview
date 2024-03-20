
export type MapblockPos = {
    x: number
    y: number
    z: number
}

export type ManifestEntry = {
    filename: string
    pos: MapblockPos
}

export type Manifest = ManifestEntry[]