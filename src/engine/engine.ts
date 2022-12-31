import { Position } from "../utility";
import { opposite, Side, toDirection } from "./side";

export type Value = any;

export interface Grid {
    at(position: Position): Cell;
}

export interface Cell {
    put(side: Side, value: Value): Promise<void>;
    get(side: Side): Promise<Value>;
}

export type Process = (context: ProcessContext) => Promise<void>

export interface ProcessContext {
    pull: (side: Side) => Promise<Value>
    push: (side: Side, value: Value) => Promise<void>
    synchronize: () => Promise<void>
}

export class Engine extends EventTarget {

    constructor(private readonly grid: Grid) {
        super();
    }

    /**
     * Constructs the process context for @param position and starts @param process
     * Processes can read values from neighboring cells, push values, etc.
     */
    async run(position: Position, process: Process): Promise<void> {
        // pull dequeues a value from one of the cell's internal buffer
        const pull = async (side: Side) => {
            const value = await this.grid.at(position).get(side);
            return value;
        }
        // push writes a value to a neighboring cell
        const push = async (side: Side, value: Value) => {
            const neighbor = this.grid.at(position.add(toDirection(side)));
            await neighbor.put(opposite(side), value);
        };
        // synchronize is resolved during the grid's next step
        const synchronize = () => new Promise<void>(resolve => {
            this.addEventListener("step", (evt) => resolve(), { once: true });
        });
        await process({ push, pull, synchronize });
    }

    step() {
        this.dispatchEvent(new Event("step"));
    }

}