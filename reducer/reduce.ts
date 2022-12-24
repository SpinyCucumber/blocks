import { Composition, Expr, Mapping, Variable } from "../syntax";
import { singleDispatch } from "../utility";

/**
 * Variables cannot be reduced.
 */
export const reduce = singleDispatch<Expr, Expr>([
    [Variable, expr => expr],
    [Mapping, (expr: Mapping) => expr.map(value => reduce(value))],
    [Composition, (expr: Composition) => {
        const first = reduce(expr.first);
        const second = reduce(expr.second);
        if (first instanceof Mapping && second instanceof Mapping) {
            console.log(`Composing ${first} with ${second}`);
            return second.map(value => evaluate(value, first));
        }
        return expr;
    }],
]);

export const substitute = singleDispatch<Expr, (mapping: Mapping, depth: number) => Expr>([
    // If variable's side is defined by the mapping, substitute
    [Variable, (expr: Variable) => ((mapping, depth) => {
        if (expr.depth === depth) {
            const { side } = expr;
            if (mapping.has(side)) {
                console.log(`Substituting ${expr} with ${mapping.get(side)}`);
                return mapping.get(side);
            }
        }
        return expr;
    })],
    [Mapping, (expr: Mapping) => ((mapping, depth) => expr.map(value => substitute(value)(mapping, depth + 1)))],
    [Composition, ({first, second}: Composition) => ((mapping, depth) => 
        new Composition(substitute(first)(mapping, depth), substitute(second)(mapping, depth))
    )],
]);

export function evaluate(expr: Expr, mapping: Mapping) {
    return reduce(substitute(expr)(mapping, 1));
}