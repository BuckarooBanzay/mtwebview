import WorldMap from './map/WorldMap.js';
import MapLoaderWorker from './map/MapLoaderWorker.js';
import MeshGenerator from './mesh/MeshGenerator.js';
import PlainMeshGenerator from './mesh/PlainMeshGenerator.js';
import Scene from './scene/Scene.js';
import MaterialManager from './texture/MaterialManager.js';
import TextureGenerator from './texture/TextureGenerator.js';

/**
 * main webview entry-point, provides convienience functions to render the view
 */
export default class WebView {
    constructor(cfg) {
        this.active = true;
        this.scene = new Scene(cfg.target);
        this.worldmap = new WorldMap(cfg.source.mapblock, cfg.source.nodedef)

        if (cfg.source.media && cfg.source.nodedef) {
            // "fancy" rendering with textures
            const textureGen = new TextureGenerator(cfg.source.media)
            const materialmgr = new MaterialManager(textureGen, cfg.wireframe)
            this.meshgen = new MeshGenerator(this.worldmap,)
            this.mapworker = new MapLoaderWorker(this.scene, this.worldmap, this.meshgen, materialmgr, 1)

        } else if (cfg.source.colormapping) {
            // plain boxes
            this.meshgen = new PlainMeshGenerator(this.worldmap, cfg.source.colormapping)
            this.mapworker = new MapLoaderWorker(this.scene, this.worldmap, this.meshgen, 1)

        } else {
            throw new Error("no source.media/source.nodedef or source.colormapping provided")
        }

        this.mapworker.start()
    }

    /**
     * Load and render the area between given positions
     */
    async render(pos1, pos2) {
        await this.worldmap.loadArea(pos1, pos2)
        const mesh = await this.meshgen.createMesh(pos1, pos2)
        this.scene.addMesh(mesh)
    }

    /**
     * removes the webview and cleans up all ressources
     */
    remove() {
        this.mapworker.stop()
        this.scene.remove();
    }
}
