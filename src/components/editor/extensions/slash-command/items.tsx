import type { Editor } from '@tiptap/react';
import {
  CheckSquare,
  Code,
  Heading1,
  Heading2,
  Heading3,
  ImageIcon,
  List,
  ListOrdered,
  Text as TextIcon,
  TextQuote,
  Minus,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface SuggestionItem {
  title: string;
  description: string;
  icon: LucideIcon;
  searchTerms: string[];
  command: ({ editor, range }: { editor: Editor; range: any }) => void;
}

export const suggestionItems: SuggestionItem[] = [
  // Basic Blocks
  {
    title: 'Text',
    description: 'Just start writing with plain text.',
    searchTerms: ['p', 'paragraph'],
    icon: TextIcon,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setParagraph().run();
    },
  },
  {
    title: 'Heading 1',
    description: 'Big section heading.',
    searchTerms: ['h1', 'heading', 'title', 'big', 'large'],
    icon: Heading1,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 1 }).run();
    },
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    searchTerms: ['h2', 'heading', 'subtitle', 'medium'],
    icon: Heading2,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 2 }).run();
    },
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    searchTerms: ['h3', 'heading', 'subtitle', 'small'],
    icon: Heading3,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setNode('heading', { level: 3 }).run();
    },
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list.',
    searchTerms: ['bullets', 'unordered', 'point'],
    icon: List,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBulletList().run();
    },
  },
  {
    title: 'Numbered List',
    description: 'Create a list with numbering.',
    searchTerms: ['numbered', 'ordered'],
    icon: ListOrdered,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleOrderedList().run();
    },
  },
  {
    title: 'To-do List',
    description: 'Track tasks with a to-do list.',
    searchTerms: ['todo', 'task', 'list', 'check', 'checkbox'],
    icon: CheckSquare,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleTaskList().run();
    },
  },
  {
    title: 'Quote',
    description: 'Capture a quote.',
    searchTerms: ['blockquote'],
    icon: TextQuote,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBlockquote().run();
    },
  },
  {
    title: 'Code',
    description: 'Capture a code snippet.',
    searchTerms: ['codeblock', 'pre', 'program'],
    icon: Code,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleCodeBlock().run();
    },
  },
  {
    title: 'Divider',
    description: 'Visually divide blocks.',
    searchTerms: ['hr', 'separator'],
    icon: Minus,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setHorizontalRule().run();
    },
  },
  {
    title: 'Image',
    description: 'Upload an image from your computer.',
    searchTerms: ['photo', 'picture', 'media'],
    icon: ImageIcon,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).run();
      // upload image
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/*';
      input.onchange = async () => {
        if (input.files?.length) {
          const file = input.files[0];
          const url = URL.createObjectURL(file);
          editor.chain().focus().setImage({ src: url }).run();
        }
      };
      input.click();
    },
  },

  // Formatting
  {
    title: 'Bold',
    description: 'Make text bold.',
    searchTerms: ['strong'],
    icon: Bold,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleBold().run();
    },
  },
  {
    title: 'Italic',
    description: 'Make text italic.',
    searchTerms: ['em'],
    icon: Italic,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleItalic().run();
    },
  },
  {
    title: 'Underline',
    description: 'Underline text.',
    searchTerms: ['u'],
    icon: Underline,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleUnderline().run();
    },
  },
  {
    title: 'Strikethrough',
    description: 'Strike through text.',
    searchTerms: ['s', 'strikethrough'],
    icon: Strikethrough,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleStrike().run();
    },
  },
  {
    title: 'Highlight',
    description: 'Highlight text.',
    searchTerms: ['mark', 'highlight'],
    icon: Highlighter,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).toggleHighlight().run();
    },
  },

  // Alignment
  {
    title: 'Align Left',
    description: 'Align text to left.',
    searchTerms: ['left', 'align'],
    icon: AlignLeft,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setTextAlign('left').run();
    },
  },
  {
    title: 'Align Center',
    description: 'Align text to center.',
    searchTerms: ['center', 'align'],
    icon: AlignCenter,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setTextAlign('center').run();
    },
  },
  {
    title: 'Align Right',
    description: 'Align text to right.',
    searchTerms: ['right', 'align'],
    icon: AlignRight,
    command: ({ editor, range }) => {
      editor.chain().focus().deleteRange(range).setTextAlign('right').run();
    },
  },
];
