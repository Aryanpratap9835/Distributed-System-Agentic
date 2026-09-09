'use client'

import { useState, type FormEvent } from 'react'
export default function CreateJob() {
    const [jobType, setJobType] = useState("")
    const [priority, setPriority] = useState("")
    const [payload, setPayload] = useState("")
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log(jobType)
        console.log(priority)
        console.log(payload)
    }
    return (
        <main>
            <div>
                <h1>Create New Job</h1>

                <form onSubmit={handleSubmit}>
                    <label>Job Type</label>

                    <select
                        value={jobType}
                        onChange={(e) => setJobType(e.target.value)}
                    >
                        <option value="AI-REVIEWER">AI-REVIEWER</option>
                        <option value="CODE-EXECUTION">CODE-EXECUTION</option>
                        <option value="DATA-PROCESSING">DATA-PROCESSING</option>
                    </select>

                    <label>Priority</label>

                    <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option value="HIGH">HIGH</option>
                        <option value="MEDIUM">MEDIUM</option>
                        <option value="LOW">LOW</option>
                    </select>

                    <label>Payload</label>

                    <textarea
                        value={payload}
                        onChange={(e) => setPayload(e.target.value)}
                    />

                    <button type="submit">
                        Create Job
                    </button>
                </form>
            </div>
        </main>
    )
}