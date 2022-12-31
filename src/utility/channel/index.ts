import BlockingQueue from "../blocking-queue";

/**
 * A channel is similar to a message queue, but with the additional
 * requirement that messages must be received.
 * For send(s) to resolve, receive() must be called exactly once,
 * and vice versa.
 * A channel can be thought of as a "symmetric queue."
 */
export default class Channel<S> {

    private sent = new BlockingQueue<S>();
    private received = new BlockingQueue<void>();

    send(s: S): Promise<void> {
        this.sent.enqueue(s);
        return this.received.dequeue();
    }

    receive(): Promise<S> {
        this.received.enqueue();
        return this.sent.dequeue();
    }

}