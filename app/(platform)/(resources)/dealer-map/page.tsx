import InteractiveMap from "./interactive-map";

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Dealership Map</h1>
        <InteractiveMap />
      </div>
    </div>
  );
}
