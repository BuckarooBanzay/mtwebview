import * as THREE from '/node_modules/three/build/three.module.js';

console.log(THREE)


if (typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope) {
    console.log("worker!")
}