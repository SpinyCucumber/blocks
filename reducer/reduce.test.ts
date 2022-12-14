import { test, expect } from "@jest/globals";
import { Composition, Mapping, Variable } from "../syntax";
import { reduce, substitute } from "./reduce";

test("should substitute variables", () => {
    const mapping = Mapping.of([[2, Variable.forSide(0)]]);
    const expr = Variable.forSide(2);
    expect(substitute(expr)(mapping)).toBe(Variable.forSide(0));
});

test("should substitute nested", () => {
    const mapping = Mapping.of([[2, Variable.forSide(0)]]);
    const expr = Mapping.of([[3, Variable.forSide(2)]]);
    expect(substitute(expr)(mapping)).toEqual(Mapping.of([[3, Variable.forSide(0)]]));
});

test("should reduce composition", () => {
    const expr = Composition.of(Mapping.of([[0, Variable.forSide(3)]]), Mapping.of([[2, Variable.forSide(0)]]));
    expect(reduce(expr)).toEqual(Mapping.of([[2, Variable.forSide(3)]]));
});