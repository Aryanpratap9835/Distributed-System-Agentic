import type { Models } from "../../prisma/contract";
class Queue<T> {
    private queue: T[] = [];
    enqueue(jobs: T): void {
        this.queue.push(jobs)
    }
    dequeue(): T | undefined {
        return this.queue.shift()
    }
}

export const jobQueue = new Queue<Models.public_Job>();
