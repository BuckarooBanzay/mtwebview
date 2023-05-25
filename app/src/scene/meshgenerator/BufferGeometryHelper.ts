import { BufferAttribute, BufferGeometry, Material, Mesh } from "three";
import { Pos } from "../../util/Pos";
import { NodeSide } from "../../types/NodeSide";

export class BufferGeometryHelper {
    constructor(public material: Material) {}

    vertices = new Array<number>()
    uvs = new Array<number>()
    colors = new Array<number>()

    max_index = 0
    indices = new Array<number>()

    createNodeMeshSide(pos: Pos, side: NodeSide, light: number) {
        // inverted gl/canvas position
        const gl_pos = new Pos(pos.x*-1, pos.y, pos.z)

        const default_uvs = [
            0.0, 0.0,
            1.0, 0.0,
            1.0, 1.0,
            0.0, 1.0,
        ]

        const o = this.max_index
        this.max_index += 4
        const default_indices_pos = [
            o+0, o+1, o+2,
            o+0, o+2, o+3
        ]
        const default_indices_neg = [
            o+2, o+1, o+0,
            o+3, o+2, o+0
        ]

        this.uvs.push(...default_uvs)

        switch (side) {
            case NodeSide.YP:
                this.vertices.push(
                    gl_pos.x-0.5, gl_pos.y+0.5, gl_pos.z+0.5,
                    gl_pos.x+0.5, gl_pos.y+0.5, gl_pos.z+0.5,
                    gl_pos.x+0.5, gl_pos.y+0.5, gl_pos.z-0.5,
                    gl_pos.x-0.5, gl_pos.y+0.5, gl_pos.z-0.5,
                )
        
                this.indices.push(...default_indices_pos)
                break;
            case NodeSide.YN:
                this.vertices.push(
                    gl_pos.x-0.5, gl_pos.y-0.5, gl_pos.z+0.5,
                    gl_pos.x+0.5, gl_pos.y-0.5, gl_pos.z+0.5,
                    gl_pos.x+0.5, gl_pos.y-0.5, gl_pos.z-0.5,
                    gl_pos.x-0.5, gl_pos.y-0.5, gl_pos.z-0.5,
                )
        
                this.indices.push(...default_indices_neg)
                break;
            case NodeSide.XN: //inverted x-axis
                this.vertices.push(
                    gl_pos.x+0.5, gl_pos.y-0.5, gl_pos.z+0.5,
                    gl_pos.x+0.5, gl_pos.y-0.5, gl_pos.z-0.5,
                    gl_pos.x+0.5, gl_pos.y+0.5, gl_pos.z-0.5,
                    gl_pos.x+0.5, gl_pos.y+0.5, gl_pos.z+0.5,
                )
        
                this.indices.push(...default_indices_pos)
                break;
            case NodeSide.XP: //inverted x-axis
                this.vertices.push(
                    gl_pos.x-0.5, gl_pos.y-0.5, gl_pos.z+0.5,
                    gl_pos.x-0.5, gl_pos.y-0.5, gl_pos.z-0.5,
                    gl_pos.x-0.5, gl_pos.y+0.5, gl_pos.z-0.5,
                    gl_pos.x-0.5, gl_pos.y+0.5, gl_pos.z+0.5,
                )
        
                this.indices.push(...default_indices_neg)
                break;
            case NodeSide.ZP:
                this.vertices.push(
                    gl_pos.x-0.5, gl_pos.y-0.5, gl_pos.z+0.5,
                    gl_pos.x+0.5, gl_pos.y-0.5, gl_pos.z+0.5,
                    gl_pos.x+0.5, gl_pos.y+0.5, gl_pos.z+0.5,
                    gl_pos.x-0.5, gl_pos.y+0.5, gl_pos.z+0.5,
                )
        
                this.indices.push(...default_indices_pos)
                break;
            case NodeSide.ZN:
                this.vertices.push(
                    gl_pos.x-0.5, gl_pos.y-0.5, gl_pos.z-0.5,
                    gl_pos.x+0.5, gl_pos.y-0.5, gl_pos.z-0.5,
                    gl_pos.x+0.5, gl_pos.y+0.5, gl_pos.z-0.5,
                    gl_pos.x-0.5, gl_pos.y+0.5, gl_pos.z-0.5,
                )
        
                this.indices.push(...default_indices_neg)
                break;
        }

        const default_colors = []
        for (let i=0; i<12; i++) {
            default_colors.push(light)
        }
        this.colors.push(...default_colors)
    }

    toMesh(): Mesh {
        const geometry = new BufferGeometry()
        geometry.setIndex(this.indices)
        geometry.setAttribute('position', new BufferAttribute(new Float32Array(this.vertices), 3))
        geometry.setAttribute('uv', new BufferAttribute(new Float32Array(this.uvs), 2))
        geometry.setAttribute('color', new BufferAttribute(new Float32Array(this.colors), 3))

        return new Mesh(geometry, this.material)
    }
}