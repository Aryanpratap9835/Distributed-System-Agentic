import type { Models } from "../../prisma/contract";
class Queue<T> {
    private queue: T[] = [];
    private processes: T[] = [];
    enqueue(jobs: T): void {
        this.queue.push(jobs)
    }
    dequeue(): T | undefined {
        return this.queue.shift()
    }
    claim(): T | undefined {
        const job = this.queue.shift();
        if (!job) return undefined;
        this.processes.push(job);
        return job;
    }
    ack(job: T): void {
        this.processes = this.processes.filter(item => item !== job)
    };
    recover(job: T): void {
        this.processes = this.processes.filter(item => item !== job);
        this.queue.push(job);
    }
}

export const jobQueue = new Queue<Models.public_Job>();
