export class BlockingQueue<T> {

    private promises: Promise<T>[] = [];
    private resolvers: ((t: T) => void)[] = [];

    private add() {
      this.promises.push(new Promise(resolve => {
        this.resolvers.push(resolve);
      }));
    }

    enqueue(t: T) {
      if (this.resolvers.length === 0) this.add();
      const resolve = this.resolvers.shift();
      resolve(t);
    }

    dequeue(): Promise<T> {
      if (this.promises.length === 0) this.add();
      return this.promises.shift();
    }

    isEmpty() {
      return this.promises.length === 0;
    }

    isBlocked() {
      return this.resolvers.length > 0;
    }

}