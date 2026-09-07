function Card(props: { title: string, value: string, description: string }) {
  return (

    <div className="rounded-lg border p-6">
      <h2 className="font-bold">{props.title}</h2>
      <p className="text-2xl">{props.value}</p>
      <span>{props.description}</span>
    </div>

  )
}
export default function Home() {
  return (
    <>
      <main className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card title="Active Jobs" value="21" description="There are total 21 jobs running" />
        <Card title="Workers" value="12" description="List of the Workers are 12" />
      </main>
    </>

  );
}
