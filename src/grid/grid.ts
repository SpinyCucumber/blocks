import { Position, Vector, BlockingQueue } from "../utility";
import { Map, Seq } from "immutable";
import Deque from "double-ended-queue";

type Value = any;
type Side = Vector;

/**
 * A tile is defined by a "program", which is executed once.
 * The environment is the set of actions available to the program,
 * which includes waiting on a value (pulling) or pushing a value to
 * a neighboring cell.
 */
export abstract class Tile {
    abstract process(environment: Environment): void
}

export interface Environment {
    pull: () => Promise<Value>
    push: (side: Side, value: Value) => void
}

export interface CellOptions {
    tile: Tile;
}

class Cell {

    pushed = new Deque<Value>();
    queue = new BlockingQueue<Value>();
    tile: Tile;

    constructor({ tile }: CellOptions) {
        this.tile = tile;
    }

}

export interface GridOptions {
    cells: Iterable<[Position, CellOptions]>;
}

export class Grid {

    // We use immutable.js to create a mapping between 2D coordinates and cells
    private cells: Map<Position, Cell>;

    constructor({ cells }: GridOptions) {
        this.cells = Map(Seq(cells).map(([position, options]) => ([position, new Cell(options)])));
    }

    start(): void {
        for (const [position, cell] of this.cells.entries()) {
            // Construct the environment for the process
            // pull dequeues a value from the cell's internal queue
            const pull = cell.queue.dequeue;
            // push pushes a value to the pushed buffer of a neighboring cell
            const push = (side: Side, value: Value) => {
                const neighbor = this.cells.get(position.add(side));
                if (neighbor) neighbor.pushed.enqueue(value);
            };
            // Start cell process
            cell.tile.process({ pull, push });
        }
    }

    step(): void {
        // For each cell, move pushed values into internal queue
        for (const { pushed, queue } of this.cells.values()) {
            while (!pushed.isEmpty()) {
                queue.enqueue(pushed.dequeue());
            }
        }
    }

}