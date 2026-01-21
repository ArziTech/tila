'use client';

import { Button } from '../ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { Check, Trash2 } from 'lucide-react';
import { type Editor } from '@tiptap/react';
import { useEffect, useRef } from 'react';

export function isValidUrl(url: string) {
  try {
    new URL(url);
    return true;
  } catch (_e) {
    return false;
  }
}

export function getUrlFromString(str: string) {
  if (isValidUrl(str)) return str;
  try {
    if (str.includes('.') && !str.includes(' ')) {
      return new URL(`https://${str}`).toString();
    }
  } catch (_e) {
    return null;
  }
}

interface LinkSelectorProps {
  editor: Editor;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export const LinkSelector = ({ editor, isOpen, setIsOpen }: LinkSelectorProps) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Autofocus on input by default
  useEffect(() => {
    inputRef.current?.focus();
  }, [isOpen]);

  return (
    <Popover modal open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="sm" variant="ghost" className="gap-2 rounded-none border-none">
          <p className="text-base">↗</p>
          <p
            className={cn('underline decoration-stone-400 underline-offset-4', {
              'text-blue-500': editor.isActive('link'),
            })}
          >
            Link
          </p>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-60 p-0" sideOffset={10}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const input = e.currentTarget[0] as HTMLInputElement;
            const url = getUrlFromString(input.value);
            if (url) {
              editor.chain().focus().setLink({ href: url }).run();
              setIsOpen(false);
            }
          }}
          className="flex p-1"
        >
          <input
            ref={inputRef}
            type="text"
            placeholder="Paste a link"
            className="flex-1 bg-background p-1 text-sm outline-none"
            defaultValue={editor.getAttributes('link').href || ''}
          />
          {editor.getAttributes('link').href ? (
            <Button
              size="icon"
              variant="outline"
              type="button"
              className="flex h-8 items-center rounded-sm p-1 text-red-600 transition-all hover:bg-red-100 dark:hover:bg-red-800"
              onClick={() => {
                editor.chain().focus().unsetLink().run();
                if (inputRef.current) inputRef.current.value = '';
                setIsOpen(false);
              }}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          ) : (
            <Button size="icon" className="h-8">
              <Check className="h-4 w-4" />
            </Button>
          )}
        </form>
      </PopoverContent>
    </Popover>
  );
};
