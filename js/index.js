import WebView from './WebView.js';
import Pos from './util/Pos.js';
import { parseBase64GzMapblock, parseRawMapblock } from './parser/MapParser.js';
import { REVISION } from 'three';
import { is_worker, init_worker } from './worker.js';

if (is_worker()) {
    // worker mode, start worker
    init_worker()
} else {
    // main mode, library export
    window.ltview = {
        // main api
        WebView,
        Pos,
        // mapblock parsing helper
        parseBase64GzMapblock,
        parseRawMapblock,
        // version
        ThreeJSVersion: REVISION
    };
}
