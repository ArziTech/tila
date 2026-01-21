import type { Editor } from '@tiptap/react';

export interface SlashCommand {
  title: string;
  description: string;
  icon: string;
  keywords?: string[];
  action: (editor: Editor) => void;
}

export const slashCommands: SlashCommand[] = [
  // Basic Blocks
  {
    title: 'Text',
    description: 'Just start writing with plain text.',
    icon: 'text',
    keywords: ['paragraph', 'p'],
    action: (editor) => editor.chain().focus().setParagraph().run(),
  },
  {
    title: 'Heading 1',
    description: 'Big section heading.',
    icon: 'heading-1',
    keywords: ['h1', 'heading', 'title'],
    action: (editor) => editor.chain().focus().toggleHeading({ level: 1 }).run(),
  },
  {
    title: 'Heading 2',
    description: 'Medium section heading.',
    icon: 'heading-2',
    keywords: ['h2', 'heading'],
    action: (editor) => editor.chain().focus().toggleHeading({ level: 2 }).run(),
  },
  {
    title: 'Heading 3',
    description: 'Small section heading.',
    icon: 'heading-3',
    keywords: ['h3', 'heading'],
    action: (editor) => editor.chain().focus().toggleHeading({ level: 3 }).run(),
  },
  {
    title: 'Bullet List',
    description: 'Create a simple bullet list.',
    icon: 'list',
    keywords: ['bullets', 'unordered'],
    action: (editor) => editor.chain().focus().toggleBulletList().run(),
  },
  {
    title: 'Numbered List',
    description: 'Create a list with numbering.',
    icon: 'list-ordered',
    keywords: ['numbered', 'ordered'],
    action: (editor) => editor.chain().focus().toggleOrderedList().run(),
  },
  {
    title: 'To-do List',
    description: 'Track tasks with a to-do list.',
    icon: 'check-square',
    keywords: ['todo', 'task', 'checkbox'],
    action: (editor) => editor.chain().focus().toggleTaskList().run(),
  },
  {
    title: 'Quote',
    description: 'Capture a quote.',
    icon: 'quote',
    keywords: ['blockquote'],
    action: (editor) => editor.chain().focus().toggleBlockquote().run(),
  },
  {
    title: 'Code',
    description: 'Capture a code snippet.',
    icon: 'code',
    keywords: ['pre', 'program'],
    action: (editor) => editor.chain().focus().toggleCodeBlock().run(),
  },
  {
    title: 'Divider',
    description: 'Visually divide blocks.',
    icon: 'minus',
    keywords: ['hr', 'separator'],
    action: (editor) => editor.chain().focus().setHorizontalRule().run(),
  },

  // Formatting
  {
    title: 'Bold',
    description: 'Make text bold.',
    icon: 'bold',
    keywords: ['strong'],
    action: (editor) => editor.chain().focus().toggleBold().run(),
  },
  {
    title: 'Italic',
    description: 'Make text italic.',
    icon: 'italic',
    keywords: ['em'],
    action: (editor) => editor.chain().focus().toggleItalic().run(),
  },
  {
    title: 'Underline',
    description: 'Underline text.',
    icon: 'underline',
    action: (editor) => editor.chain().focus().toggleUnderline().run(),
  },
  {
    title: 'Strikethrough',
    description: 'Strike through text.',
    icon: 'strikethrough',
    action: (editor) => editor.chain().focus().toggleStrike().run(),
  },
  {
    title: 'Highlight',
    description: 'Highlight text.',
    icon: 'highlighter',
    action: (editor) => editor.chain().focus().toggleHighlight().run(),
  },

  // Alignment
  {
    title: 'Align Left',
    description: 'Align text to left.',
    icon: 'align-left',
    action: (editor) => editor.chain().focus().setTextAlign('left').run(),
  },
  {
    title: 'Align Center',
    description: 'Align text to center.',
    icon: 'align-center',
    action: (editor) => editor.chain().focus().setTextAlign('center').run(),
  },
  {
    title: 'Align Right',
    description: 'Align text to right.',
    icon: 'align-right',
    action: (editor) => editor.chain().focus().setTextAlign('right').run(),
  },
];

export const groupedCommands = {
  basic: slashCommands.filter(cmd =>
    ['Text', 'Heading 1', 'Heading 2', 'Heading 3', 'Bullet List', 'Numbered List', 'To-do List', 'Quote', 'Code', 'Divider'].includes(cmd.title)
  ),
  formatting: slashCommands.filter(cmd =>
    ['Bold', 'Italic', 'Underline', 'Strikethrough', 'Highlight'].includes(cmd.title)
  ),
  alignment: slashCommands.filter(cmd =>
    ['Align Left', 'Align Center', 'Align Right'].includes(cmd.title)
  ),
};
