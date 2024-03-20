
export default class {
    constructor(mediasource) {
        this.mediasource = mediasource;
    }

    createTexture(tiledef) {
        return new Promise(resolve => {
            this.mediasource(tiledef)
            .then(ab => console.log(ab))
        })
    }
}