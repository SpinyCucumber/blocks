import { Vector, Position, Mapping } from "../utility";
import { Map } from "immutable";

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

    /**
     * A simple tile can be expressed as a function of evalNeighbors
     */
    export abstract class Simple extends Tile {

        abstract apply(neighbors: SideValues): SideValues;

        eval(grid: Grid, position: Position): SideValues {
            return this.apply(evalNeighbors(grid, position));
        }

    }

    export class Mimic extends Tile {

        private inputSide: Side;

        constructor(inputSide: Side) {
            super();
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

    export class Constructor extends Tile {

        private outputSide: Side;

        constructor(outputSide: Side) {
            super();
            this.outputSide = outputSide;
        }

        eval(grid: Grid, position: Position): SideValues {
            const constructed = new (class extends Simple {
                apply(neighbors: SideValues): SideValues {
                    // To evaluate the constructed tile, we create a "virtual grid"
                    // where the constructor tile is replaced with a constant tile,
                    // and we evaluate the neighboring tiles of the constant tile.
                    const sub = new Constant(neighbors);
                    const subGrid: Grid = {
                        at(subPosition) {
                            if (subPosition.equals(position)) return sub;
                            return grid.at(subPosition);
                        }
                    };
                    return evalNeighbors(subGrid, position);
                }
            })();
            return Map([[this.outputSide, constructed]]);
        }

    }

    export class Pipe extends Simple {

        private connections: Mapping<Side, Side>;

        constructor(connections: Mapping<Side, Side>) {
            super();
            this.connections = connections;
        }

        apply(neighbors: SideValues): SideValues {
            return {
                get: (side) => neighbors.get(this.connections.get(side))
            }
        }

    }

    export class Constant extends Simple {

        private values: SideValues;

        constructor(values: SideValues) {
            super();
            this.values = values;
        }
        
        apply(): SideValues {
            return this.values;
        }

    }

}