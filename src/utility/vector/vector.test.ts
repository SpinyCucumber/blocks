import { test, expect } from "@jest/globals";
import { directions, Vector } from ".";
import { List } from "immutable";

test("should enumerate directions", () => {
    expect(directions).toEqual(List([
        new Vector({ x: 1, y: 0 }),
        new Vector({ x: 0, y: 1 }),
        new Vector({ x: -1, y: 0 }),
        new Vector({ x: 0, y: -1 }),
    ]));
});