import Card from "./Card";
interface CardProps {
    id: number
    title: string
    value: string
    description: string
}
export default function StatsGrid({ cards }: { cards: CardProps[] }) {
    return (
        <div className="grid grid-cols-4 gap-4">
            {cards.map((card) =>
                <Card
                    key={card.id}
                    title={card.title}
                    value={card.value}
                    description={card.description}
                />
            )
            }
        </div>
    );
}