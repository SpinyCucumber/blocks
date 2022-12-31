import { List } from "immutable";

export class Pair {
    constructor(readonly x: number, readonly y: number) {}
}

export class Position extends Pair {

    /**
     * Adding a vector to a position produces a position
     */
    add(v: Vector): Position {
        return new Position(this.x + v.x, this.y + v.y);
    }

    /**
     * Subtracting a position from a position produces a vector
     */
    subtract(p: Position): Vector {
        return new Vector(this.x - p.x, this.y - p.y);
    }

}

export class Vector extends Pair {

    add(v: Vector): Vector {
        return new Vector(this.x + v.x, this.y + v.y);
    }

    scale(f: number): Vector {
        return new Vector(f * this.x, f * this.y);
    }

    /**
     * Returns this vector rotated 90 degrees clockwise
     */
    rotate() {
        return new Vector(-this.y, this.x);
    }

}

/**
 * A pairing function which maps each integer pair (including negative integers) to a unique integer.
 * Credit to https://codepen.io/sachmata/post/elegant-pairing, and
 * https://gist.github.com/TheGreatRambler/048f4b38ca561e6566e0e0f6e71b7739
 */
export function pair({ x, y }: Pair): number {
    const xx = (x >= 0) ? (2 * x) : (-2 * x - 1);
    const yy = (y >= 0) ? (2 * y) : (-2 * y - 1);
    return (xx >= yy) ? (xx * xx + xx + yy) : (yy * yy + xx);
}

export function *enumerateDirections(): Generator<Vector> {
    let direction = new Vector(1,0);
    for (let i = 0; i < 4; i++) {
        yield direction;
        direction = direction.rotate();
    }
}

export function *enumerateGrid(min: Position, max: Position): Generator<Position> {
    for (let y = min.y; y < max.y; y++) {
        for (let x = min.x; x < max.x; x++) {
            yield new Position(x, y);
        }
    }
}

export const directions = List(enumerateDirections());