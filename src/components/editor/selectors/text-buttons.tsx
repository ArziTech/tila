'use client';

import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { BoldIcon, CodeIcon, ItalicIcon, StrikethroughIcon, UnderlineIcon } from 'lucide-react';
import { type Editor } from '@tiptap/react';
import type { SelectorItem } from './node-selector';

export const TextButtons = ({ editor }: { editor: Editor }) => {
  const items: SelectorItem[] = [
    {
      name: 'bold',
      isActive: (editor) => editor.isActive('bold'),
      command: (editor) => editor.chain().focus().toggleBold().run(),
      icon: BoldIcon,
    },
    {
      name: 'italic',
      isActive: (editor) => editor.isActive('italic'),
      command: (editor) => editor.chain().focus().toggleItalic().run(),
      icon: ItalicIcon,
    },
    {
      name: 'underline',
      isActive: (editor) => editor.isActive('underline'),
      command: (editor) => editor.chain().focus().toggleUnderline().run(),
      icon: UnderlineIcon,
    },
    {
      name: 'strike',
      isActive: (editor) => editor.isActive('strike'),
      command: (editor) => editor.chain().focus().toggleStrike().run(),
      icon: StrikethroughIcon,
    },
    {
      name: 'code',
      isActive: (editor) => editor.isActive('code'),
      command: (editor) => editor.chain().focus().toggleCode().run(),
      icon: CodeIcon,
    },
  ];

  return (
    <div className="flex">
      {items.map((item, index) => (
        <div
          key={index}
          onClick={() => {
            item.command(editor);
          }}
        >
          <Button size="sm" className="rounded-none" variant="ghost" type="button">
            <item.icon
              className={cn('h-4 w-4', {
                'text-blue-500': item.isActive(editor),
              })}
            />
          </Button>
        </div>
      ))}
    </div>
  );
};
