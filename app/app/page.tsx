'use client'
import { useState } from "react";
import Header from "./components/Header";
import Box from "./components/Box";
import StatsGrid from "./components/StatsGrid";
const cards = [
  {
    id: 1,
    title: "Active Jobs",
    value: "21",
    description: "There are total 21 Active Jobs are running",
  },
  {
    id: 2,
    title: "Workers",
    value: "12",
    description: "There are total 12 Workers",
  },
  {
    id: 3,
    title: "Queue",
    value: "5",
    description: "There are total 5 Jobs in Queue",
  },
  {
    id: 4,
    title: "Failed Jobs",
    value: "3",
    description: "Total 3 jobs failed",
  },
];
export default function Home() {
  const [search, setSearch] = useState("");
  const filterCard = cards.filter((card) =>
    card.title.toLowerCase().includes(search.toLowerCase()));

  return (
    <main>

      <Box>
        <Header />
      </Box>
      <input value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder=" Search for Jobs" />
      <StatsGrid cards={filterCard} />

    </main>
  )
}
