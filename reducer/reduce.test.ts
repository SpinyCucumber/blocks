import { test, expect } from "@jest/globals";
import { Composition, Mapping, Variable } from "../syntax";
import { reduce, substitute } from "./reduce";

test("should substitute variables", () => {
    const mapping = new Mapping([[2, new Variable(0, 1)]]);
    const expr = new Variable(2, 1);
    expect(substitute(expr)(mapping, 1)).toEqual(new Variable(0, 1));
});

test("should substitute nested", () => {
    const mapping = new Mapping([[2, new Variable(0, 1)]]);
    const expr = new Mapping([[3, new Variable(2, 2)]]);
    expect(substitute(expr)(mapping, 1)).toEqual(new Mapping([[3, new Variable(0, 1)]]));
});

test("should reduce composition", () => {
    const expr = new Composition(new Mapping([[0, new Variable(3, 1)]]), new Mapping([[2, new Variable(0, 1)]]));
    expect(reduce(expr)).toEqual(new Mapping([[2, new Variable(3, 1)]]));
});