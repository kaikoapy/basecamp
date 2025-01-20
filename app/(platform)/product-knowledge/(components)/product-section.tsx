interface ProductSectionProps {
  title: string;
  items: string[];
}

export function ProductSection({ title, items }: ProductSectionProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">{title}</h2>
      <ul className="list-disc list-inside space-y-2">
        {items.map((item, index) => (
          <li key={index} className="text-gray-800">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
