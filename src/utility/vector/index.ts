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

function *enumerateDirections(): Generator<Vector> {
    let direction = new Vector(1,0);
    for (let i = 0; i < 4; i++) {
        yield direction;
        direction = direction.rotate();
    }
}

export const directions = List(enumerateDirections());