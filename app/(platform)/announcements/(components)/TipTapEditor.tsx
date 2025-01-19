// src/components/TiptapEditor.tsx
import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import "@/app/(platform)/announcements/styles.css";
// Define the props interface
interface TiptapEditorProps {
  content: string;
  onChange: (html: string) => void;
}

const TiptapEditor: React.FC<TiptapEditorProps> = ({ content, onChange }) => {
  const editor = useEditor({
    extensions: [StarterKit],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  return (
    <EditorContent
      editor={editor}
      className="editor-no-focus-outline focus:outline-none"
    />
  );
};

export default TiptapEditor;
