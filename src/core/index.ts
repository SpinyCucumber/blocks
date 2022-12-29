import { Position, Vector, BlockingQueue, directions } from "../utility";
import { Map, Set, Seq } from "immutable";
import { Subject, firstValueFrom } from "rxjs";

export type Value = any;

/**
 * A side is a vector.
 * The set of sides is closed under multiplication by -1;
 * i.e., every side has an opposite.
 */
export type Side = Vector;
export const sides = Set(directions);

/**
 * A tile is defined by a "process", which is executed concurrently for each cell
 * at the start of the computation.
 * The environment is the set of actions available to the program,
 * which includes waiting on a value (pulling) or pushing a value to
 * a neighboring cell.
 */
export abstract class Tile {
    abstract process(context: ProcessContext): void
}

export interface ProcessContext {
    pull: (side: Side) => Promise<Value>
    push: (side: Side, value: Value) => void
    synchronize: () => Promise<void>
}

export interface CellOptions {
    tile: Tile;
}

/**
 * A cell contains a data queue for each side, which can be written to and read from.
 * The behavior of a cell is defined by a tile.
 */
class Cell {

    queues = Map(Seq(sides).map(side => ([side, new BlockingQueue<Value>()])));
    tile: Tile;

    constructor({ tile }: CellOptions) {
        this.tile = tile;
    }

    private getQueue(side: Side) {
        return this.queues.get(side) as BlockingQueue<Value>;
    }

    write(side: Side, value: Value): void {
        this.getQueue(side).enqueue(value);
    }

    read(side: Side): Promise<Value> {
        return this.getQueue(side).dequeue();
    }

}

export interface Push {
    position: Position;
    side: Side;
    value: Value;
}

export interface Pull {
    position: Position;
    side: Side;
    value: Value;
}

export class CoreError extends Error {}

export interface GridOptions {
    cells: Iterable<[Position, CellOptions]>;
}

export class Grid {

    // We use immutable.js to create a mapping between 2D coordinates and cells
    private cells: Map<Position, Cell>;

    // Used to synchronize cells
    readonly step = new Subject<void>();
    // Push/pull events
    readonly push = new Subject<Push>();
    readonly pull = new Subject<Pull>();

    constructor({ cells }: GridOptions) {
        this.cells = Map(Seq(cells).map(([position, options]) => ([position, new Cell(options)])));
    }

    getCell(position: Position): Cell {
        // TODO Lazy cell creation would greatly simplify things
        return this.cells.get(position)!;
    }

    /**
     * Creates the context for a process executing at @param position
     * Processes can read values from neighboring cells, push values, etc.
     */
    createProcessContext(position: Position): ProcessContext {
        // pull dequeues a value from one of the cell's internal queue
        const pull = async (side: Side) => {
            const value = await this.getCell(position).read(side);
            this.pull.next({ position, side, value });
            return value;
        }
        // push writes a value to a neighboring cell
        const push = (side: Side, value: Value) => {
            this.push.next({ position, side, value });
            const neighbor = this.getCell(position.add(side));
            neighbor.write(side.scale(-1), value);
        };
        // synchronize is resolved during the grid's next step
        const synchronize = () => firstValueFrom(this.step);
        return { push, pull, synchronize };
    }

    start(): void {
        for (const [position, cell] of this.cells.entries()) {
            // Start cell process
            // TODO Should separate cells and tiles
            cell.tile.process(this.createProcessContext(position));
        }
    }

}