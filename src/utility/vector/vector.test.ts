import { test, expect } from "@jest/globals";
import { directions, enumerateGrid, pair, Position, Vector } from ".";
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

test("should add vectors to positions", () => {
    expect(new Position(1,1).add(new Vector(3,5))).toEqual(new Position(4,6));
    expect(new Position(0,0).add(new Vector(-10,0))).toEqual(new Position(-10,0));
});

test("should pair uniquely", () => {
    // Obviously, we can't check that every pair maps to a unique integer,
    // but this should give us a good idea
    const pairings = new Set<number>();
    const positions = enumerateGrid(new Position(-10, -10), new Position(11, 11));
    for (const position of positions) {
        const pairing = pair(position);
        expect(pairings.has(pairing)).toBeFalsy();
        pairings.add(pairing);
    }
});