import { directions } from "../utility/vector";

/**
 * A side is represented by a number, which is an index of one of the four
 * cardinal directions. Sides can be converted to their respective direction,
 * and also support an opposite operation, where s = opposite(opposite(s))
 */
export const enum Side {
    Right = 0,
    Down = 1,
    Left = 2,
    Up = 3,
}

export const numSides = 4;

export function toDirection(side: Side) {
    return directions.get(side)!;
}

export function opposite(side: Side): Side {
    return (side + (numSides / 2)) % numSides;
}