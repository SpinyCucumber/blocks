import { Subject } from "rxjs";
import { firstValueFrom } from "rxjs/internal/firstValueFrom";
import { Channel } from "../utility";
import { pair, Position } from "../utility/vector";
import { opposite, Side, numSides, toDirection } from "./side";

export type Value = any;

export class Cell {

    private channels = new Array<Channel<Value>>(numSides);

    getChannel(side: Side) {
        if (this.channels[side] === undefined) return (this.channels[side] = new Channel());
        return this.channels[side];
    }

}

export type Process<T> = (context: ProcessContext) => Promise<T>

export interface ProcessContext {
    pull: (side: Side) => Promise<Value>
    push: (side: Side, value: Value) => Promise<void>
    synchronize: () => Promise<void>
}

export class Engine {

    private cells = new Map<number, Cell>();
    readonly step = new Subject<void>();

    getCell(position: Position): Cell {
        // We use a pairing function (which maps each integer pair to a unique integer)
        // to convert positions into number keys. This allows us to use vanilla JS Maps.
        const pairing = pair(position);
        if (!this.cells.has(pairing)) {
            const cell = new Cell();
            this.cells.set(pairing, cell);
            return cell;
        }
        return this.cells.get(pairing)!;
    }

    /**
     * Constructs the process context for @param position and starts @param process
     * Processes can read values from neighboring cells, push values, etc.
     */
    run<T>(position: Position, process: Process<T>): Promise<T> {
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
        const synchronize = () => firstValueFrom(this.step);
        return process({ push, pull, synchronize });
    }

}