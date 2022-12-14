import { directions } from "../utility";
import { Map } from "immutable";
import { Side } from "./side";

export type Expr = Mapping | Composition | Variable;

/**
 * Maps any number of sides to an expression.
 * Can be thought of as an environment, or bindings.
 */
export class Mapping {

    readonly internal: Map<Side, Expr>;

    constructor(internal: Map<Side, Expr>) {
        this.internal = internal;
    }

    static of(entries: Iterable<[Side, Expr]>) {
        return new Mapping(Map(entries));
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