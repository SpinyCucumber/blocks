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
    
    const producer = {
        async process({ push }: ProcessContext) {
            await push(Side.Right, 7);
        }
    };

    const consumer = {
        async process({ pull }: ProcessContext) {
            const value = await pull(Side.Left);
            expect(value).toBe(7);
        }
    };

    await Promise.all([
        engine.run(producer, new Position(0, 0)),
        engine.run(consumer, new Position(1, 0)),
    ]);

});

test("should await synchronize", async () => {

    const engine = new Engine();

    const counter = {
        value: 0,
        async process({ synchronize }: ProcessContext) {
            while (true) {
                await synchronize();
                this.value += 1;
            }
        }
    }

    engine.run(counter, new Position(0, 0));
    for (let i = 0; i < 20; i++) {
        expect(counter.value).toBe(i);
        await engine.step.next();
    }

});