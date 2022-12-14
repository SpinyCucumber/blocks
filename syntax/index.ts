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

export type Expr = Expr.Mapping | Expr.Composition | Expr.Variable;

export namespace Expr {

    /**
     * Maps any number of sides to an expression.
     * Can be thought of as an environment, or bindings.
     */
    export type Mapping = Map<Side, Expr>;

    /**
     * Composes two mappings into a single mapping.
     * This is accomplished by substituting each map of the first mapping into the second mapping.
     */
    export interface Composition {
        first: Expr;
        second: Expr;
    }

    /**
     * A reference to a side.
     */
    export interface Variable {
        side: Side;
    }

}