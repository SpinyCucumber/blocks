import { test, expect } from "@jest/globals";
import { directions, enumerateGrid, Position, Vector } from ".";
import { List } from "immutable";

test("should enumerate directions", () => {
    expect(directions).toEqual(List([
        new Vector(1, 0),
        new Vector(-0, 1),
        new Vector(-1,-0),
        new Vector(0,-1),
    ]));
});

test("should enumerate grid", () => {
    const min = new Position(0, 0);
    const max = new Position(3, 3);
    expect(Array.from(enumerateGrid(min, max))).toEqual([
        new Position(0, 0),
        new Position(1, 0),
        new Position(2, 0),
        new Position(0, 1),
        new Position(1, 1),
        new Position(2, 1),
        new Position(0, 2),
        new Position(1, 2),
        new Position(2, 2),
    ]);
});

test("should scale vectors", () => {
    expect(new Vector(5,10).scale(3)).toEqual(new Vector(15,30));
    expect(new Vector(0,10).scale(-1)).toEqual(new Vector(-0,-10));
});

test("should pair uniquely", () => {
    // TODO
});