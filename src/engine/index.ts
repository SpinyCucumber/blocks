import { Channel } from "../utility";
import { Position } from "../utility/vector";
import { opposite, Side, sides, toDirection } from "./side";

export type Value = any;

export class Cell {

    private channels = new Array<Channel<Value>>(sides.size);

    getChannel(side: Side) {
        if (this.channels[side] === undefined) this.channels[side] = new Channel();
        return this.channels[side];
    }

}

export type Process = (context: ProcessContext) => Promise<void>

export interface ProcessContext {
    pull: (side: Side) => Promise<Value>
    push: (side: Side, value: Value) => Promise<void>
    synchronize: () => Promise<void>
}

export class Engine extends EventTarget {

    private cells = new Map<number, Cell>();

    getCell(position: Position): Cell {
        // TODO
    }

    /**
     * Constructs the process context for @param position and starts @param process
     * Processes can read values from neighboring cells, push values, etc.
     */
    async run(position: Position, process: Process): Promise<void> {
        // pull dequeues a value from one of the cell's internal buffer
        const pull = async (side: Side) => {
            const value = await this.getCell(position).getChannel(side).receive();
            return value;
        }
        // push writes a value to a neighboring cell
        const push = async (side: Side, value: Value) => {
            const neighbor = this.getCell(position.add(toDirection(side)));
            await neighbor.getChannel(opposite(side)).send(value);
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