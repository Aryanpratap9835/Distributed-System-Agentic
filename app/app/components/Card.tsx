'use client'
import { useState } from 'react'
interface Cardprops {
    title: string;
    value: string;
    description: string;
}
export default function Card({ title, value, description }: Cardprops) {
    const [count, setCount] = useState(Number(value));
    return (
        <div className="rounded-lg border p-6">
            <h2 className="font-bold">{title}</h2>
            <p className="text-2xl">{count}</p>
            <button onClick={() => setCount(count + 1)}> Increase </button>
            {count > 0 && <button onClick={() => setCount(count - 1)}> Decrease </button>}
            <span>{description}</span>
        </div>
    );
}