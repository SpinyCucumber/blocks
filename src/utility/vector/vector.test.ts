import { test, expect } from "@jest/globals";
import { directions, Vector } from ".";
import { List } from "immutable";

test("should enumerate directions", () => {
    expect(directions).toEqual(List([
        new Vector(1,0),
        new Vector(0,1),
        new Vector(-1,0),
        new Vector(0,-1),
    ]));
});