import InteractiveMap from "./interactive-map";

export default function Page() {
  return (
    <div className="flex-1 overflow-auto">
      <main className="p-6 max-w-[1600px] mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dealership Map</h1>
        <InteractiveMap />
      </main>
    </div>
  );
}
