
type TileDefinition = {
    name: string
    tileable_vertical: boolean
}

type NodeDefinition = {
    name: string
    id: number
    drawtype: string
    light_source: number
    paramtype: string
    paramtype2: string
    tiles: TileDefinition[]
}