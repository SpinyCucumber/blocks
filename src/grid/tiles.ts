import { Map } from "immutable";
import { Tile, Side, Environment } from "./grid";

export class Pipe extends Tile {

    private connections: Map<Side, Side>;
    
    constructor(connections: Iterable<[Side, Side]>) {
        super();
        this.connections = Map(connections);
    }
    
    async process({ pull, push }: Environment) {
        const processes = this.connections.entrySeq().map(([input, output]) =>
            async () => {
                while (true) {
                    const value = await pull(input);
                    // TODO Synchronize
                    push(output, value);
                }
            }
        );
        await Promise.all(processes);
    }

}

export class AddTwo extends Tile {

    constructor(
        private readonly inputA: Side,
        private readonly inputB: Side,
        private readonly output: Side) {
        super();
    }
    
    async process({ pull, push }: Environment) {
        while (true) {
            const a = await pull(this.inputA);
            const b = await pull(this.inputB);
            // TODO Synchronize
            push(this.output, a + b);
        }
    }

}