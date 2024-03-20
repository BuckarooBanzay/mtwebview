import WorldMap from './map/WorldMap.js';
import Scene from './scene/Scene.js';

export default class WebView {

    constructor(cfg) {
        this.scene = new Scene(cfg.target);
        this.worldmap = new WorldMap(cfg.source.mapblock)
    }

    remove() {

    }
}
