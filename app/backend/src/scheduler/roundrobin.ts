export class RoundRobin {
    private workers: string[];
    private currentIndex: number;

    constructor(workers: string[]) {
        this.workers = workers;
        this.currentIndex = 0;
    }
    setWorker(workers: string[]) {
        this.workers = workers
        if (this.workers.length == 0) {
            this.currentIndex = 0;
            return;
        }
        this.currentIndex = this.currentIndex % this.workers.length
    }

    next() {
        if (this.workers.length === 0) {
            return null;
        }

        const worker = this.workers[this.currentIndex];

        this.currentIndex =
            (this.currentIndex + 1) % this.workers.length;

        return worker;
    }
}