import { BufferGeometry, Color, Float32BufferAttribute, InstancedMesh, Material, Matrix, Matrix4, Mesh, PlaneGeometry, Vector3 } from "three";
import { Pos } from "../../util/Pos";
import { NodeSide } from "../../types/NodeSide";

const rotations = new Map<NodeSide, Matrix4>()
rotations.set(NodeSide.XP, new Matrix4().makeRotationY(-Math.PI/2))
rotations.set(NodeSide.XN, new Matrix4().makeRotationY(Math.PI/2))
rotations.set(NodeSide.YN, new Matrix4().makeRotationX(Math.PI/2))
rotations.set(NodeSide.YP, new Matrix4().makeRotationX(-Math.PI/2))
rotations.set(NodeSide.ZP, new Matrix4())
rotations.set(NodeSide.ZN, new Matrix4().makeRotationX(Math.PI))

const face_offsets = new Map<NodeSide, Pos>()
// inverted gl/canvas x-position
face_offsets.set(NodeSide.XN, new Pos(-0.5, 0, 0))
face_offsets.set(NodeSide.XP, new Pos(+0.5, 0, 0))
face_offsets.set(NodeSide.YN, new Pos(0, -0.5, 0))
face_offsets.set(NodeSide.YP, new Pos(0, +0.5, 0))
face_offsets.set(NodeSide.ZN, new Pos(0, 0, -0.5))
face_offsets.set(NodeSide.ZP, new Pos(0, 0, +0.5))

enum Axis {
    X = 0,
    Y = 1,
    Z = 2
}

export class BufferGeometryHelper {
    constructor(public material: Material) {}

    indices = new Array<number>()
    vertices = new Array<number>()
    normals = new Array<number>()
    uvs = new Array<number>()
    numberOfVertices = 0

    // taken from https://raw.githubusercontent.com/mrdoob/three.js/dev/src/geometries/BoxGeometry.js
    buildPlane(offset: Pos, u: Axis, v: Axis, w: Axis, udir: number, vdir: number, depth: number, light: number) {
        let vertexCounter = 0;
        const vector = new Vector3();

        //TODO: light
        // generate vertices, normals and uvs
        for ( let iy = 0; iy < 2; iy ++ ) {
            const y = iy * 0.5
            for ( let ix = 0; ix < 2; ix ++ ) {
                const x = ix * 0.5

                vector.setComponent(u, offset.x + (x * udir))
                vector.setComponent(v, offset.y + (y * vdir))
                vector.setComponent(w, offset.z + (depth / 2))

                // now apply vector to vertex buffer
                this.vertices.push(vector.x, vector.y, vector.z);

                // set values to correct vector component
                vector.setComponent(u, 0)
                vector.setComponent(v, 0)
                vector.setComponent(w, depth > 0 ? 1 : - 1)

                // now apply vector to normal buffer
                this.normals.push(vector.x, vector.y, vector.z);

                // uvs
                this.uvs.push(ix);
                this.uvs.push(1 - iy);

                // counters
                vertexCounter += 1;

            }

        }

        for ( let iy = 0; iy < 2; iy ++ ) {
            for ( let ix = 0; ix < 2; ix ++ ) {
                const a = this.numberOfVertices + ix + 2 * iy;
                const b = this.numberOfVertices + ix + 2 * ( iy + 1 );
                const c = this.numberOfVertices + ( ix + 1 ) + 2 * ( iy + 1 );
                const d = this.numberOfVertices + ( ix + 1 ) + 2 * iy;

                // faces
                this.indices.push( a, b, d );
                this.indices.push( b, c, d );
            }

        }

        this.numberOfVertices += vertexCounter;
    }

    createNodeMeshSide(pos: Pos, side: NodeSide, light: number) {
        //TODO: inverted gl/canvas position

        switch (side) {
            case NodeSide.XP:
                this.buildPlane(pos, Axis.Z, Axis.Y, Axis.X, -1, -1, 1, light)
                break
            case NodeSide.XN:
                this.buildPlane(pos, Axis.Z, Axis.Y, Axis.X, 1, -1, -1, light)
                break
            case NodeSide.YP:
                this.buildPlane(pos, Axis.X, Axis.Z, Axis.Y, 1, 1, 1, light)
                break
            case NodeSide.YN:
                this.buildPlane(pos, Axis.X, Axis.Z, Axis.Y, 1, -1, -1, light)
                break
            case NodeSide.ZP:
                this.buildPlane(pos, Axis.X, Axis.Y, Axis.Z, 1, -1, 1, light)
                break
            case NodeSide.ZN:
                this.buildPlane(pos, Axis.X, Axis.Y, Axis.Z, -1, -1, -1, light)
                break
        }
    }

    toMesh(): Mesh {
        const bg = new BufferGeometry()
        bg.setIndex(this.indices)
		bg.setAttribute( 'position', new Float32BufferAttribute( this.vertices, 3 ) );
		bg.setAttribute( 'normal', new Float32BufferAttribute( this.normals, 3 ) );
		bg.setAttribute( 'uv', new Float32BufferAttribute( this.uvs, 2 ) );

        return new Mesh(bg, this.material)
    }
}