// types/story.ts
export interface Chapter {
  number: number;
  title: string;
  content: string;
  icon?: string; // Optional icon name for each chapter
}

export interface Story {
  title: string;
  introduction: string;
  theme?: string; // Optional theme/category of the story
  chapters: Chapter[];
  conclusion?: string; // Optional conclusion
}
