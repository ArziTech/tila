'use client';

import { useEffect, useState } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Text,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  CheckSquare,
  Quote,
  Code,
  Minus,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Highlighter,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from 'lucide-react';
import type { Editor } from '@tiptap/react';
import { groupedCommands } from './commands';

interface SlashCommandMenuProps {
  editor: Editor;
  query: string;
  onSelect: () => void;
}

const iconMap = {
  'text': Text,
  'heading-1': Heading1,
  'heading-2': Heading2,
  'heading-3': Heading3,
  'list': List,
  'list-ordered': ListOrdered,
  'check-square': CheckSquare,
  'quote': Quote,
  'code': Code,
  'minus': Minus,
  'bold': Bold,
  'italic': Italic,
  'underline': UnderlineIcon,
  'strikethrough': Strikethrough,
  'highlighter': Highlighter,
  'align-left': AlignLeft,
  'align-center': AlignCenter,
  'align-right': AlignRight,
};

export function SlashCommandMenu({ editor, query, onSelect }: SlashCommandMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const allCommands = [
    ...groupedCommands.basic,
    ...groupedCommands.formatting,
    ...groupedCommands.alignment,
  ];

  const filteredCommands = allCommands.filter(cmd => {
    const search = cmd.title.toLowerCase() + (cmd.keywords?.join('') || '');
    return search.includes(query.toLowerCase());
  });

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((i) => (i + 1) % filteredCommands.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((i) => (i - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === 'Enter' && filteredCommands.length > 0) {
      e.preventDefault();
      filteredCommands[selectedIndex].action(editor);
      onSelect();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [filteredCommands, selectedIndex, editor, onSelect]);

  if (filteredCommands.length === 0) {
    return <CommandEmpty>No results found.</CommandEmpty>;
  }

  return (
    <CommandList>
      <CommandGroup heading="Basic Blocks">
        {groupedCommands.basic
          .filter(cmd => {
            const search = cmd.title.toLowerCase() + (cmd.keywords?.join('') || '');
            return search.includes(query.toLowerCase());
          })
          .map((cmd, index) => {
            const globalIndex = filteredCommands.indexOf(cmd);
            const Icon = iconMap[cmd.icon as keyof typeof iconMap] || Text;
            return (
              <CommandItem
                key={cmd.title}
                value={cmd.title}
                onSelect={() => {
                  cmd.action(editor);
                  onSelect();
                }}
                className={globalIndex === selectedIndex ? 'bg-accent' : ''}
              >
                <Icon className="mr-2 h-4 w-4" />
                <div>
                  <p className="font-medium">{cmd.title}</p>
                  <p className="text-xs text-muted-foreground">{cmd.description}</p>
                </div>
              </CommandItem>
            );
          })}
      </CommandGroup>

      <CommandGroup heading="Formatting">
        {groupedCommands.formatting
          .filter(cmd => {
            const search = cmd.title.toLowerCase() + (cmd.keywords?.join('') || '');
            return search.includes(query.toLowerCase());
          })
          .map((cmd) => {
            const globalIndex = filteredCommands.indexOf(cmd);
            const Icon = iconMap[cmd.icon as keyof typeof iconMap] || Text;
            return (
              <CommandItem
                key={cmd.title}
                value={cmd.title}
                onSelect={() => {
                  cmd.action(editor);
                  onSelect();
                }}
                className={globalIndex === selectedIndex ? 'bg-accent' : ''}
              >
                <Icon className="mr-2 h-4 w-4" />
                <div>
                  <p className="font-medium">{cmd.title}</p>
                  <p className="text-xs text-muted-foreground">{cmd.description}</p>
                </div>
              </CommandItem>
            );
          })}
      </CommandGroup>

      <CommandGroup heading="Alignment">
        {groupedCommands.alignment
          .filter(cmd => {
            const search = cmd.title.toLowerCase() + (cmd.keywords?.join('') || '');
            return search.includes(query.toLowerCase());
          })
          .map((cmd) => {
            const globalIndex = filteredCommands.indexOf(cmd);
            const Icon = iconMap[cmd.icon as keyof typeof iconMap] || Text;
            return (
              <CommandItem
                key={cmd.title}
                value={cmd.title}
                onSelect={() => {
                  cmd.action(editor);
                  onSelect();
                }}
                className={globalIndex === selectedIndex ? 'bg-accent' : ''}
              >
                <Icon className="mr-2 h-4 w-4" />
                <div>
                  <p className="font-medium">{cmd.title}</p>
                  <p className="text-xs text-muted-foreground">{cmd.description}</p>
                </div>
              </CommandItem>
            );
          })}
      </CommandGroup>
    </CommandList>
  );
}
