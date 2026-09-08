import React from "react"
import { ReactNode } from "react"
export default function Box({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {children}
        </div>
    )
}