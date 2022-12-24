import { Vector, Position } from "../utility";

/**
 * A side is a vector.
 * The set of all sides is closed under scaling by -1;
 * i.e., every side has an opposite side.
 */
export type Side = Vector;

export type Value = any;

export type SideMapping = (side: Side) => Value | undefined;

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
export interface Tile {
    eval(grid: Grid, position: Position): SideMapping;
}

export function evalNeighbors(grid: Grid, position: Position): SideMapping {
    return (side) => {
        const adjacent = position.add(side);
        return grid.at(adjacent).eval(grid, adjacent)(side.scale(-1));
    }
}

export abstract class SimpleTile implements Tile {

    abstract apply(neighbors: SideMapping): SideMapping;

    eval(grid: Grid, position: Position): SideMapping {
        return this.apply(evalNeighbors(grid, position));
    }

}