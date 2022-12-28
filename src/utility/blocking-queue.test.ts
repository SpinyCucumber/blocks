import { test, expect } from "@jest/globals";
import { BlockingQueue } from "./blocking-queue";

test("should operate as queue", async () => {
    const queue = new BlockingQueue<number>();
    queue.enqueue(3);
    queue.enqueue(4);
    expect(await queue.dequeue()).toBe(3);
    expect(await queue.dequeue()).toBe(4);
});

test("should support async operation", async () => {

    expect.assertions(2);
    const queue = new BlockingQueue<number>();

    async function queueValues() {
        queue.enqueue(3);
        queue.enqueue(4);
    }

    async function dequeueValues() {
        expect(await queue.dequeue()).toBe(3);
        expect(await queue.dequeue()).toBe(4);
    }

    await Promise.all([
        dequeueValues(),
        queueValues(),
    ]);

});