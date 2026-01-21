import { Extension } from '@tiptap/core';
import Suggestion from '@tiptap/suggestion';
import { slashCommands } from './commands';
import type { Editor } from '@tiptap/react';

export const SlashCommand: any = Extension.create({
  name: 'slashCommand',

  addOptions() {
    return {
      suggestion: {
        char: '/',
        command: ({ editor, range, props }: { editor: Editor; range: any; props: any }) => {
          props.action(editor);
          editor.view.dispatch(
            editor.state.tr.deleteRange(range.from, range.to)
          );
        },
      },
    };
  },

  addProseMirrorPlugins() {
    return [
      Suggestion({
        ...this.options.suggestion,
        items: ({ query }: { query: string }) => {
          return slashCommands.filter(item => {
            const search = item.title.toLowerCase() + (item.keywords?.join('') || '');
            return search.includes(query.toLowerCase());
          });
        },
      }),
    ];
  },
});
