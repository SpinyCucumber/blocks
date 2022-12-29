import { ProcessContext, Side, Tile } from "../core";

export default class AddTwo extends Tile {

    constructor(
        private readonly inputA: Side,
        private readonly inputB: Side,
        private readonly output: Side) {
        super();
    }
    
    async process({ pull, push, synchronize }: ProcessContext) {
        while (true) {
            const a = await pull(this.inputA);
            const b = await pull(this.inputB);
            await synchronize();
            push(this.output, a + b);
        }
    }

}