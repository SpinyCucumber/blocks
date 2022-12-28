import { Tile, Side, Environment } from "./grid";

export class Pipe extends Tile {

    constructor(private readonly output: Side) {
        super();
    }
    
    async process({ pull, push }: Environment) {
        while (true) {
            push(this.output, await pull());
        }
    }

}

export class AddTwo extends Tile {

    constructor(private readonly output: Side) {
        super();
    }
    
    async process({ pull, push }: Environment) {
        while (true) {
            const a = await pull();
            const b = await pull();
            push(this.output, a + b);
        }
    }

}