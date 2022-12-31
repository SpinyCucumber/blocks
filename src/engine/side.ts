import { directions } from "../utility/vector";
import { Set } from "immutable";

/**
 * A side is represented by a number, which is an index of one of the four
 * cardinal directions. Sides can be converted to their respective direction,
 * and also support an opposite operation, where s = opposite(opposite(s))
 */
export type Side = number;
export const sides = Set(directions.keys());

export function toDirection(side: Side) {
    return directions.get(side)!;
}

export function opposite(side: Side) {
    return (side + (sides.size / 2)) % sides.size;
}