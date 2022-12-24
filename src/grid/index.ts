import { Vector, Position, Mapping } from "../utility";

/**
 * A side is a vector.
 * The set of all sides is closed under scaling by -1;
 * i.e., every side has an opposite side.
 */
export type Side = Vector;

export type Value = any;

export type SideValues = Mapping<Side, Value | undefined>;

/**
 * A grid maps each position to a tile.
 */
export interface Grid {
    at(position: Position): Tile;
}

/**
 * A general tile produces values along each side when
 * evaluated at a position on a grid.
 */
export abstract class Tile {
    abstract eval(grid: Grid, position: Position): SideValues;
}

export function evalNeighbors(grid: Grid, position: Position): SideValues {
    return {
        get(side) {
            const adjacent = position.add(side);
            return grid.at(adjacent).eval(grid, adjacent).get(side.scale(-1));
        }
    }
}

export namespace Tile {

    export abstract class Simple implements Tile {

        abstract apply(neighbors: SideValues): SideValues;

        eval(grid: Grid, position: Position): SideValues {
            return this.apply(evalNeighbors(grid, position));
        }

    }

    export class Mimic implements Tile {

        private inputSide: Side;

        Mimic(inputSide: Side) {
            this.inputSide = inputSide;
        }

        eval(grid: Grid, position: Position): SideValues {
            const toMimic = evalNeighbors(grid, position).get(this.inputSide);
            if (!(toMimic instanceof Tile)) {
                // TODO More detailed error
                throw new Error("Can only mimic tiles.");
            }
            return toMimic.eval(grid, position);
        }

    }

    export class Pipe extends Simple {

        private connections: Mapping<Side, Side>;

        Pipe(connections: Mapping<Side, Side>) {
            this.connections = connections;
        }

        apply(neighbors: SideValues): SideValues {
            return {
                get: (side) => neighbors.get(this.connections.get(side))
            }
        }

    }

}