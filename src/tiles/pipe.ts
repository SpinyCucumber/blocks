import { ProcessContext, Side, Tile } from "../engine";
import { Map } from "immutable";

export default class Pipe extends Tile {
    
    constructor(private readonly connections: Map<Side, Side>) {
        super();
    }
    
    async process({ pull, push, synchronize }: ProcessContext) {
        const promises = this.connections.entrySeq().map(([input, output]) =>
            (async () => {
                while (true) {
                    const value = await pull(input);
                    await synchronize();
                    await push(output, value);
                }
            })()
        ).toArray();
        await Promise.all(promises);
    }

}