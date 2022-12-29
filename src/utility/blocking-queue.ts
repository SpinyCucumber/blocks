import Deque from "double-ended-queue";

type Resolver<T> = (t: T) => void;

export class BlockingQueue<T> {

    private promises = new Deque<Promise<T>>();
    private resolvers = new Deque<Resolver<T>>();

    private add() {
      this.promises.enqueue(new Promise(resolve => {
        this.resolvers.enqueue(resolve);
      }));
    }

    enqueue(t: T) {
      if (this.resolvers.length === 0) this.add();
      const resolve = this.resolvers.dequeue() as Resolver<T>;
      resolve(t);
    }

    dequeue(): Promise<T> {
      if (this.promises.length === 0) this.add();
      return this.promises.dequeue() as Promise<T>;
    }

    isEmpty() {
      return this.promises.length === 0;
    }

    isBlocked() {
      return this.resolvers.length > 0;
    }

}