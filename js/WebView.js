import WorldMap from './map/WorldMap.js';
import MeshGenerator from './mesh/MeshGenerator.js';
import Scene from './scene/Scene.js';
import MaterialManager from './texture/MaterialManager.js';
import TextureGenerator from './texture/TextureGenerator.js';

export default class WebView {

    constructor(cfg) {
        this.scene = new Scene(cfg.target);
        this.worldmap = new WorldMap(cfg.source.mapblock, cfg.source.nodedef)

        const textureGen = new TextureGenerator(cfg.source.media)
        const materialmgr = new MaterialManager(textureGen, cfg.wireframe)
        this.meshgen = new MeshGenerator(this.worldmap, materialmgr, cfg.source.media)
    }

    async render(pos1, pos2, progress_callback) {
        progress_callback = progress_callback || function() {}
        await this.worldmap.loadArea(pos1, pos2, (progress, msg) => {
            progress_callback(progress * 0.5, `Loading mapblock: ${msg}`)
        })
        const mesh = await this.meshgen.createMesh(pos1, pos2, (progress, msg) => {
            progress_callback((progress * 0.5) + 0.5, `Rendering node ${msg}`)
        })
        this.scene.addMesh(mesh)
    }

    remove() {

    }
}
