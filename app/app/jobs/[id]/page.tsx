import Link from "next/link";
import { jobs } from "../../data/jobs"
export default async function JobPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const job = jobs.find((job) => job.id === (id));

    if (!job) {
        return (
            <main className="min-h-screen bg-gray-950 text-white p-8">
                <div className="max-w-4xl mx-auto">

                    <Link
                        href="/jobs"
                        className="text-gray-400 hover:text-white"
                    >
                        ← Back To Jobs
                    </Link>

                    <div className="mt-10 bg-gray-900 border border-gray-800 rounded-xl p-8 text-center">
                        <h1 className="text-3xl font-bold mb-3">
                            Job Not Found
                        </h1>

                        <p className="text-gray-400 mb-6">
                            No job exists with ID #{id}
                        </p>

                        <Link
                            href="/jobs"
                            className="inline-block bg-white text-black px-4 py-2 rounded-lg hover:bg-gray-200"
                        >
                            Back To Jobs
                        </Link>
                    </div>

                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-gray-950 text-white p-8">

            <div className="max-w-4xl mx-auto">

                {/* Back button */}
                <Link
                    href="/jobs"
                    className="text-gray-400 hover:text-white"
                >
                    ← Back To Jobs
                </Link>


                {/* Header */}
                <div className="flex items-center justify-between mt-6 mb-8">

                    <div>
                        <p className="text-gray-500 text-sm mb-1">
                            Job Details
                        </p>

                        <h1 className="text-3xl font-bold">
                            Job #{job.id}
                        </h1>
                    </div>


                    {/* Status */}
                    <span
                        className={`px-3 py-1 rounded-full text-sm font-medium
                        ${job.status === "RUNNING"
                                ? "bg-green-500/20 text-green-400"
                                : job.status === "FAILED"
                                    ? "bg-red-500/20 text-red-400"
                                    : "bg-yellow-500/20 text-yellow-400"
                            }`}
                    >
                        {job.status}
                    </span>

                </div>


                {/* Job Information */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">

                    <h2 className="text-xl font-semibold mb-5">
                        Job Information
                    </h2>

                    <div className="grid grid-cols-2 gap-6">

                        <div>
                            <p className="text-gray-400 text-sm mb-1">
                                Type
                            </p>

                            <p className="font-medium">
                                {job.type}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-400 text-sm mb-1">
                                Worker
                            </p>

                            <p className="font-medium">
                                {job.worker}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-400 text-sm mb-1">
                                Priority
                            </p>

                            <p className="font-medium">
                                {job.priority}
                            </p>
                        </div>


                        <div>
                            <p className="text-gray-400 text-sm mb-1">
                                Created
                            </p>

                            <p className="font-medium">
                                {job.createdAt}
                            </p>
                        </div>

                    </div>

                </div>


                {/* Execution Timeline */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">

                    <h2 className="text-xl font-semibold mb-6">
                        Execution Timeline
                    </h2>

                    <div className="space-y-5">

                        {/* Created */}
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                                ✓
                            </div>

                            <div>
                                <p className="font-medium">
                                    Created
                                </p>

                                <p className="text-gray-500 text-sm">
                                    Job was created
                                </p>
                            </div>
                        </div>


                        {/* Queued */}
                        <div className="flex items-center gap-4">
                            <div className="w-8 h-8 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center">
                                ✓
                            </div>

                            <div>
                                <p className="font-medium">
                                    Queued
                                </p>

                                <p className="text-gray-500 text-sm">
                                    Job entered execution queue
                                </p>
                            </div>
                        </div>


                        {/* Running */}
                        <div className="flex items-center gap-4">

                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center
                                ${job.status === "RUNNING"
                                        ? "bg-green-500/20 text-green-400"
                                        : job.status === "FAILED"
                                            ? "bg-red-500/20 text-red-400"
                                            : "bg-yellow-500/20 text-yellow-400"
                                    }`}
                            >
                                ●
                            </div>

                            <div>
                                <p className="font-medium">
                                    {job.status === "FAILED"
                                        ? "Failed"
                                        : job.status === "QUEUED"
                                            ? "Waiting"
                                            : "Running"}
                                </p>

                                <p className="text-gray-500 text-sm">
                                    {job.status === "FAILED"
                                        ? "Job execution failed"
                                        : job.status === "QUEUED"
                                            ? "Waiting for available worker"
                                            : "Worker is executing the job"}
                                </p>
                            </div>

                        </div>

                    </div>

                </div>


                {/* Execution Logs */}
                <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">

                    <h2 className="text-xl font-semibold mb-5">
                        Execution Logs
                    </h2>

                    <div className="bg-black rounded-lg p-4 font-mono text-sm space-y-3 text-gray-300">

                        <p>
                            <span className="text-gray-600">
                                [10:21:01]
                            </span>{" "}
                            Job received by scheduler
                        </p>

                        <p>
                            <span className="text-gray-600">
                                [10:21:02]
                            </span>{" "}
                            Job added to execution queue
                        </p>

                        <p>
                            <span className="text-gray-600">
                                [10:21:03]
                            </span>{" "}
                            Worker assigned: {job.worker}
                        </p>

                        <p>
                            <span className="text-gray-600">
                                [10:21:04]
                            </span>{" "}
                            Execution started
                        </p>

                        <p className="text-green-400">
                            <span className="text-gray-600">
                                [10:21:05]
                            </span>{" "}
                            Processing job...
                        </p>

                    </div>

                </div>

            </div>

        </main>
    );
}