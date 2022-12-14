import { List, Record } from "immutable";

export class Position extends Record({ x: 0, y: 0 }) {

    /**
     * Adding a vector to a position produces a position
     */
    add(v: Vector): Position {
        return new Position({ x: this.x + v.x, y: this.y + v.y });
    }

    /**
     * Subtracting a position from a position produces a vector
     */
    subtract(p: Position): Vector {
        return new Vector({ x: this.x - p.x, y: this.y - p.y });
    }

}

export class Vector extends Record({ x: 0, y: 0 }) {

    add(v: Vector): Vector {
        return new Vector({ x: this.x + v.x, y: this.y + v.y });
    }

    scale(f: number): Vector {
        return new Vector({ x: f * this.x, y: f * this.y });
    }

    /**
     * Returns this vector rotated 90 degrees clockwise
     */
    rotate() {
        return new Vector({ x: -this.y, y: this.x });
    }

}

function *enumerateDirections(): Generator<Vector> {
    let direction = new Vector({ x: 1, y: 0 });
    for (let i = 0; i < 4; i++) {
        yield direction;
        direction = direction.rotate();
    }
}

export const directions = List(enumerateDirections());