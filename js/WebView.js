import Scene from './scene/Scene.js';

export default class WebView {

    scene = new Scene();

    constructor(cfg) {
        console.log(cfg, this);
    }

    remove() {

    }
}
