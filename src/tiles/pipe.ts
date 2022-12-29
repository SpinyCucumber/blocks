import { Environment, Side, Tile } from "../core";
import { Map } from "immutable";

export default class Pipe extends Tile {

    private connections: Map<Side, Side>;
    
    constructor(connections: Iterable<[Side, Side]>) {
        super();
        this.connections = Map(connections);
    }
    
    async process({ pull, push, synchronize }: Environment) {
        const promises = this.connections.entrySeq().map(([input, output]) =>
            (async () => {
                while (true) {
                    const value = await pull(input);
                    await synchronize();
                    push(output, value);
                }
            })()
        ).toArray();
        await Promise.all(promises);
    }

}