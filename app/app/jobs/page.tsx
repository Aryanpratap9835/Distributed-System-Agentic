import Link from "next/link"
import { jobs } from "../data/jobs"
export default function Jobs() {
    return (
        <main>
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="px-4 py-3 font-semibold">Id</th>
                        <th className="px-4 py-3 font-semibold">Type</th>
                        <th className="px-4 py-3 font-semibold">Status</th>
                        <th className="px-4 py-3 font-semibold">Workers</th>
                        <th className="px-4 py-3 font-semibold">Priority</th>
                        <th className="px-4 py-3 font-semibold">Created</th>
                        <th className="px-4 py-3 font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody>

                    {jobs.map((job) =>
                        <tr key={job.id}>
                            <td className="px-4 py-3">{job.id}</td>
                            <td className="px-4 py-3">{job.type}</td>
                            <td className="px-4 py-3">
                                <span className={`px-3 py-1 rounded ${job.status === "RUNNING" ? "bg-green-500" : job.status === "FAILED" ? "bg-red-500" : "bg-yellow-500"
                                    }`}
                                >{job.status}</span></td>
                            <td className="px-4 py-3">{job.worker}</td>
                            <td className="px-4 py-3">
                                <span>{`px-4 py-3 rounded ${job.priority === "HIGH" ? "bg-red-500" : job.priority === "MEDIUM" ? "bg-yellow-500" : "bg-blue-500"}`}{job.priority}</span></td>
                            <td className="px-4 py-3">{job.createdAt}</td>
                            <td className="px-4 py-3"><Link href={`/jobs/${job.id}`}>View</Link></td>


                        </tr>
                    )
                    }
                </tbody>
            </table>
        </main>
    )
}