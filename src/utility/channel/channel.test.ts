import { test, expect } from "@jest/globals";
import Channel from ".";

test("should support multiple processes", async () => {

    const channel = new Channel<number>();

    expect.assertions(2);

    async function processA() {
        await channel.send(10);
        expect(await channel.receive()).toBe(20);
    }

    async function processB() {
        expect(await channel.receive()).toBe(10);
        await channel.send(20);
    }

    await Promise.all([processA(), processB()]);

});

test("should synchronize", async () => {

    const channel = new Channel<void>();
    const n = 20;
    let counter = 0;

    expect.assertions(n);

    async function consumer() {
        for (let i = 0; i < n; i++) {
            await channel.receive();
            expect(counter).toBe(i + 1);
        }
    }

    async function producer() {
        for (let i = 0; i < n; i++) {
            counter += 1;
            await channel.send();
        }
    }

    await Promise.all([producer(), consumer()]);

});