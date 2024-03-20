import { Material, Side } from "three"
import { MaterialManager } from "./MaterialManager"

export type MaterialKey = {
    TextureDef: string
    Transparent: boolean
    DrawSide: Side
}

export class MaterialCache {

    constructor(private mm: MaterialManager) {}

    cache = new Map<string, Material>()

    getKey(mk: MaterialKey): string {
        return `${mk.TextureDef}/${mk.DrawSide}/${mk.Transparent}`
    }

    getMaterial(mk: MaterialKey): Material|undefined {
        const key = this.getKey(mk)
        return this.cache.get(key)
    }

    generate(mk: MaterialKey): Promise<Material> {
        return this.mm.createMaterial(mk.TextureDef, mk.Transparent, mk.DrawSide)
        .then(m => {
            const key = this.getKey(mk)
            this.cache.set(key, m)
            return m
        })
    }

}