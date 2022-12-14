import { directions } from "../utility";
import { Map } from "immutable";

/**
 * Each side corresponds to one of the four cardinal directions.
 * Sides support getting the associated direction and finding the opposite side.
 */
export type Side = number;

export function getDirection(side: Side) {
    return directions.get(side);
}

export function getOpposite(side: Side): Side {
    return (side + 2) % 4;
}

export type Expr = Mapping | Composition | Variable;

/**
 * Maps any number of sides to an expression.
 * Can be thought of as an environment, or bindings.
 */
export class Mapping {

    private readonly internal: Map<Side, Expr>;

    constructor(entries: Iterable<[Side, Expr]>) {
        this.internal = Map(entries);
    }

    get(side: Side) {
        return this.internal.get(side);
    }

    has(side: Side) {
        return this.internal.has(side);
    }

    map(mapper: (value: Expr) => Expr) {
        return new Mapping(this.internal.map(mapper));
    }

    [Symbol.iterator]() {
        return this.internal[Symbol.iterator];
    }

}

/**
 * Composes two mappings into a single mapping.
 * This is accomplished by substituting each map of the first mapping into the second mapping.
 */
export class Composition {

    readonly first: Expr;
    readonly second: Expr;

    constructor(first: Expr, second: Expr) {
        this.first = first;
        this.second = second;
    }

}

/**
 * A reference to a side.
 * This type is an enumerated type, with four instances.
 * To retrieve an instance, use Variable.forSide
 */
export class Variable {

    readonly side: Side;

    constructor(side: Side) {
        this.side = side;
    }

    private static variables = directions.map((_, side) => new Variable(side));

    static forSide(side: Side) {
        return this.variables.get(side);
    }

}