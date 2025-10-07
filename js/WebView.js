import WorldMap from './map/WorldMap.js';
import MapLoader from './map/MapLoader.js';
import GeometryGenerator from './mesh/GeometryGenerator.js';
import PlainMaterialManager from './texture/PlainMaterialManager.js';
import Scene from './scene/Scene.js';
import MaterialManager from './texture/MaterialManager.js';
import TextureGenerator from './texture/TextureGenerator.js';
import WebWorker from './worker/WebWorker.js';

/**
 * main webview entry-point, provides convienience functions to render the view
 */
export default class WebView {
    constructor(cfg) {
        this.active = true;
        this.scene = new Scene(cfg.target);
        this.worldmap = new WorldMap(cfg.source.mapblock, cfg.source.nodedef)

        let materialmgr
        if (cfg.source.media && cfg.source.nodedef) {
            // "fancy" rendering with textures
            const textureGen = new TextureGenerator(cfg.source.media)
            materialmgr = new MaterialManager(textureGen)

        } else if (cfg.source.colormapping) {
            // plain boxes
            materialmgr = new PlainMaterialManager(cfg.source.colormapping)

        } else {
            throw new Error("no source.media/source.nodedef or source.colormapping provided")
        }

        this.meshgen = new GeometryGenerator(this.worldmap)

        const worker = new WebWorker("js/bundle.js") // TODO: config
        this.maploader = new MapLoader(this.scene, this.worldmap, this.meshgen, materialmgr, worker, 2)

        // TODO: config
        const config = {
            nodedefs_url: "/export/nodedefs.json"
        }

        worker.init(config).then(() => {
            this.maploader.start()
        })
    }

    /**
     * removes the webview and cleans up all ressources
     */
    remove() {
        this.maploader.stop()
        this.scene.remove();
    }
}
