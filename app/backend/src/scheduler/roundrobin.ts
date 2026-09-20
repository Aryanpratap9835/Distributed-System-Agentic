class RoundRobin {
    private workers: string[];
    private currentIndex: number;
    constructor(workers: string[]) {
        this.workers = workers
        this.currentIndex = 0;
    }
    next() {
        const workers = this.workers[this.currentIndex]
        this.currentIndex = (this.currentIndex + 1) % this.workers.length
        return workers
    }
}
const scheduler = new RoundRobin([
    "worker-1",
    "worker-2",
    "worker-3"
]);

console.log(scheduler.next());
console.log(scheduler.next());
console.log(scheduler.next());
console.log(scheduler.next());
console.log(scheduler.next());
console.log(scheduler.next());