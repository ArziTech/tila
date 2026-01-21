'use client';

import type { Editor } from '@tiptap/react';
import { BubbleMenu as TiptapBubbleMenu } from '@tiptap/react/menus';
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Highlighter,
  Link as LinkIcon,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface BubbleMenuProps {
  editor: Editor | null;
}

export function EditorBubbleMenu({ editor }: BubbleMenuProps) {
  if (!editor) return null;

  return (
    <TiptapBubbleMenu
      editor={editor}
      className="flex items-center gap-1 rounded-lg border bg-popover shadow-md p-1"
    >
      <Button
        size="sm"
        variant={editor.isActive('bold') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleBold().run()}
      >
        <Bold className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant={editor.isActive('italic') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleItalic().run()}
      >
        <Italic className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant={editor.isActive('underline') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleUnderline().run()}
      >
        <UnderlineIcon className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant={editor.isActive('strike') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleStrike().run()}
      >
        <Strikethrough className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant={editor.isActive('code') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleCode().run()}
      >
        <Code className="h-4 w-4" />
      </Button>

      <Button
        size="sm"
        variant={editor.isActive('highlight') ? 'default' : 'ghost'}
        onClick={() => editor.chain().focus().toggleHighlight().run()}
      >
        <Highlighter className="h-4 w-4" />
      </Button>

      <Separator orientation="vertical" className="h-6" />

      <Button
        size="sm"
        variant={editor.isActive('link') ? 'default' : 'ghost'}
        onClick={() => {
          const previousUrl = editor.getAttributes('link').href;
          const url = window.prompt('Enter URL', previousUrl);
          if (url === null) return;
          if (url === '') {
            editor.chain().focus().unsetLink().run();
            return;
          }
          editor.chain().focus().setLink({ href: url }).run();
        }}
      >
        <LinkIcon className="h-4 w-4" />
      </Button>
    </TiptapBubbleMenu>
  );
}
