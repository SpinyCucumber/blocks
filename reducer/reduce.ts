import { Expr } from "../syntax";
import { singleDispatch } from "../utility";

/**
 * Variables and Mappings cannot be reduced.
 */
export const reduce = singleDispatch<Expr, Expr>([
    [Expr.Variable, expr => expr],
    [Expr.Mapping, expr => expr],
    [Expr.Composition, (expr: Expr.Composition) => {
        const first = reduce(expr.first);
        const second = reduce(expr.second);
        // TODO Reduce
        return expr;
    }],
]);

export const substitute = singleDispatch<Expr, (mapping: Expr.Mapping) => Expr>([
    [Expr.Composition, ({first, second}: Expr.Composition) => (mapping => 
        new Expr.Composition(substitute(first)(mapping), substitute(second)(mapping))
    )],
    [Expr.Mapping, (expr: Expr.Mapping) => (mapping => expr.map(value => substitute(value)(mapping)))],
    // If variable's side is defined by the mapping, substitute
    [Expr.Variable, (expr: Expr.Variable) => (mapping => {
        const { side } = expr;
        if (mapping.has(side)) return mapping.get(side);
        return expr;
    })],
]);