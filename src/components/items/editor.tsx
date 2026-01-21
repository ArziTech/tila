"use client";

import { Editor } from "@/components/editor";

interface TiptapProps {
  description: string;
  onChange: (richText: string) => void;
}

const Tiptap = ({ description, onChange }: TiptapProps) => {
  return (
    <Editor
      content={description}
      onChange={onChange}
      placeholder="Type '/' for commands, or start writing..."
    />
  );
};

export default Tiptap;
