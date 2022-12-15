import { Map, Seq } from "immutable";
import { Side } from "./side";

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
        return new Mapping(Seq(this.internal).map(mapper));
    }

    toString(): string {
        return "{" + Seq(this.internal.entries()).map(([side, expr]) => `${side}: ${expr}`).toArray().join(", ") + "}";
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

    toString(): string {
        return `Compose(${this.first}, ${this.second})`;
    }

}

/**
 * A reference to a side.
 */
export class Variable {

    readonly side: Side;
    readonly depth: number;

    constructor(side: Side, depth: number) {
        this.side = side;
        this.depth = depth;
    }

    toString(): string {
        return `Variable(${this.side}, ${this.depth})`;
    }

}