import Scene from './scene/Scene.js';

export default class WebView {
    constructor(cfg) {
        this.scene = new Scene(cfg.target);
    }

    remove() {

    }
}
