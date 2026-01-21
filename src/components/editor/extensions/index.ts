import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import { TaskList } from '@tiptap/extension-task-list';
import { TaskItem } from '@tiptap/extension-task-item';
import HorizontalRule from '@tiptap/extension-horizontal-rule';
import { TextStyle } from '@tiptap/extension-text-style';
import { Color } from '@tiptap/extension-color';
import Typography from '@tiptap/extension-typography';
import Highlight from '@tiptap/extension-highlight';
import Underline from '@tiptap/extension-underline';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import { common, createLowlight } from 'lowlight';
import { SlashCommand } from './slash-command/extension';

export const defaultExtensions = (placeholder?: string) => {
  const lowlight = createLowlight(common);

  return [
    StarterKit.configure({
      codeBlock: false,
    }),
    Placeholder.configure({
      placeholder: ({ node }) => {
        if (node.type.name === 'heading') {
          return 'Heading...';
        }
        return placeholder || "Type '/' for commands...";
      },
      includeChildren: false,
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    TaskList,
    TaskItem.configure({
      nested: true,
    }),
    HorizontalRule,
    TextStyle,
    Color,
    Typography,
    Highlight,
    Underline,
    Link.configure({
      openOnClick: false,
      autolink: true,
      defaultProtocol: 'https',
    }),
    Image.configure({
      inline: true,
      allowBase64: true,
      HTMLAttributes: {
        class: 'rounded-lg border border-muted max-w-full h-auto',
      },
    }),
    CodeBlockLowlight.configure({
      lowlight,
      HTMLAttributes: {
        class: 'rounded-md bg-muted text-muted-foreground border p-4 font-mono text-sm overflow-x-auto',
      },
    }),
    SlashCommand,
  ];
};
