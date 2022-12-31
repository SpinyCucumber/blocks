import { test, expect } from "@jest/globals";
import { Engine, ProcessContext } from ".";
import { Side } from "./side";
import { Position } from "../utility/vector";

test("should cells persist", () => {
    const engine = new Engine();
    const cell = engine.getCell(new Position(-1,-1));
    expect(engine.getCell(new Position(-1,-1))).toBe(cell);
});

test("should send values", async () => {

    expect.assertions(1);

    const engine = new Engine();
    
    async function producer({ push }: ProcessContext) {
        await push(Side.Right, 7);
    }

    async function consumer({ pull }: ProcessContext) {
        const value = await pull(Side.Left);
        expect(value).toBe(7);
    }

    await Promise.all([
        engine.run(new Position(0, 0), producer),
        engine.run(new Position(1, 0), consumer),
    ]);

});