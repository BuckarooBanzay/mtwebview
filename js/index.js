import WebView from './WebView.js';
import Pos from './util/Pos.js';
import { parseBase64GzMapblock, parseRawMapblock } from './parser/MapParser.js';
import { REVISION } from 'three';

// library export
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