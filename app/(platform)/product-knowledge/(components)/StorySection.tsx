import { Story, Chapter } from "@/app/types";

// components/StorySection.tsx
interface StorySectionProps {
  story: Story;
}

export function StorySection({ story }: StorySectionProps) {
  return (
    <div className={`py-24 bg-white`}>
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Story Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold mb-4">{story.title}</h2>
          <p className="text-gray-600 italic">{story.introduction}</p>
        </div>

        {/* Chapters */}
        <div className="space-y-12">
          {story.chapters.map((chapter: Chapter) => (
            <div
              key={chapter.number}
              className="space-y-4 prose prose-gray max-w-none"
            >
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <span className="text-blue-600">Chapter {chapter.number}:</span>
                {chapter.title}
              </h3>
              <p className="text-gray-600 whitespace-pre-line">
                {chapter.content}
              </p>
            </div>
          ))}
        </div>

        {/* Optional Conclusion */}
        {story.conclusion && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <p className="text-gray-600 italic text-center">
              {story.conclusion}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
