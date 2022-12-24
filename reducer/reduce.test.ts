import { test, expect } from "@jest/globals";
import { Composition, Mapping, Variable } from "../syntax";
import { reduce, evaluate } from "./reduce";

test("should substitute variables", () => {
    const mapping = new Mapping([[2, new Variable(0, 1)]]);
    const expr = new Variable(2, 1);
    expect(evaluate(expr, mapping)).toEqual(new Variable(0, 1));
});

test("should substitute nested", () => {
    const mapping = new Mapping([[2, new Variable(0, 1)]]);
    const expr = new Mapping([[3, new Variable(2, 2)]]);
    expect(evaluate(expr, mapping)).toEqual(new Mapping([[3, new Variable(0, 1)]]));
});

test("should reduce composition", () => {
    const expr = new Composition(new Mapping([[0, new Variable(3, 1)]]), new Mapping([[2, new Variable(0, 1)]]));
    expect(reduce(expr)).toEqual(new Mapping([[2, new Variable(3, 1)]]));
});

test("should evaluate conditional", () => {
    console.log("Starting conditional test!");
    const func = new Mapping([
        [1, new Composition(
            new Mapping([[2, new Variable(2, 2)]]),
            new Composition(
                new Mapping([[0, new Variable(0, 2)]]),
                new Variable(3, 1),
            ),
        )]
    ]);
    const True = new Mapping([[1, new Variable(0, 1)]]);
    const False = new Mapping([[1, new Variable(2, 1)]]);
    const choice1 = new Mapping([[1, new Variable(3, 1)]]);
    const choice2 = new Mapping([[0, new Variable(2, 1)]]);
    const application = new Composition(
        new Mapping([[0, choice1], [2, choice2], [3, True]]),
        func
    );
    expect(reduce(application)).toEqual(new Mapping([[1, choice1]]));
});