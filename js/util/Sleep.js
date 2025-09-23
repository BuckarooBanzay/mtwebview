export const sleep = timeout => new Promise(resolve => setTimeout(resolve, timeout))

export class InteractionDelay {
    constructor() {
        this.last_yield = performance.now()
    }

    async check() {
        const now = performance.now()
        if ((now - this.last_yield) > 10) {
            // ui interaction yield/sleep
            this.last_yield = now
            await sleep(0)
        }
    }
}