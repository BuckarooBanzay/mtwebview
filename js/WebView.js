import MapLoader from './map/MapLoader.js';
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

        let materialmgr
        if (cfg.map.media_url && cfg.map.nodedefs) {
            // "fancy" rendering with textures
            const textureGen = new TextureGenerator(cfg.map.media_url)
            materialmgr = new MaterialManager(textureGen)

        } else if (cfg.map.colormapping) {
            // plain boxes
            materialmgr = new PlainMaterialManager(cfg.map.colormapping)

        } else {
            throw new Error("no source.media/source.nodedef or source.colormapping provided")
        }

        const worker = new WebWorker("js/bundle.js") // TODO: config
        this.maploader = new MapLoader(this.scene, materialmgr, worker, 2)

        worker.init(cfg.map).then(() => {
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
