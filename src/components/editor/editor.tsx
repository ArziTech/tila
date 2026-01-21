'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import type { Editor as EditorType } from '@tiptap/react';
import { useState, useCallback } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { defaultExtensions } from './extensions';
import { Separator } from './ui/separator';
import { NodeSelector } from './selectors/node-selector';
import { LinkSelector } from './selectors/link-selector';
import { ColorSelector } from './selectors/color-selector';
import { TextButtons } from './selectors/text-buttons';
import { createImageUploadHandler, handleImageDrop, handleImagePaste } from './utils/image-upload';
import { cn } from '@/lib/utils';
import './styles/editor.css';

interface EditorProps {
  content?: string;
  onChange?: (content: string) => void;
  placeholder?: string;
  className?: string;
}

export function Editor({
  content = '',
  onChange,
  placeholder = "Type '/' for commands...",
  className,
}: EditorProps) {
  const [saveStatus, setSaveStatus] = useState('Saved');
  const [wordCount, setWordCount] = useState(0);
  const [openNode, setOpenNode] = useState(false);
  const [openColor, setOpenColor] = useState(false);
  const [openLink, setOpenLink] = useState(false);

  // Create image upload handler
  const handleImageUpload = useCallback(
    (file: File) => {
      return new Promise<string>((resolve) => {
        // For now, just create a blob URL
        // In production, you'd upload to a server and get a URL back
        const url = URL.createObjectURL(file);
        resolve(url);
      });
    },
    []
  );

  // Debounced save function
  const debouncedUpdates = useDebouncedCallback(
    (editor: EditorType) => {
      const json = editor.getJSON();
      const html = editor.getHTML();

      // Calculate word count
      const text = editor.getText();
      const words = text.trim().split(/\s+/).filter((word) => word.length > 0);
      setWordCount(words.length);

      // Call onChange with HTML content
      onChange?.(html);

      // Update save status
      setSaveStatus('Saved');
    },
    500,
    { trailing: true }
  );

  const editor = useEditor({
    extensions: [...defaultExtensions(placeholder)],
    immediatelyRender: false,
    content,
    editorProps: {
      attributes: {
        class: cn(
          'prose prose-sm sm:prose lg:prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] px-8 py-4'
        ),
      },
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith('image/')) {
            const uploadHandler = createImageUploadHandler(editor!, {
              onUpload: handleImageUpload,
            });
            return handleImageDrop(view, event as DragEvent, moved, uploadHandler);
          }
        }
        return false;
      },
      handlePaste: (view, event) => {
        if (event.clipboardData?.files?.[0]) {
          const file = event.clipboardData.files[0];
          if (file.type.startsWith('image/')) {
            const uploadHandler = createImageUploadHandler(editor!, {
              onUpload: handleImageUpload,
            });
            return handleImagePaste(view, event as ClipboardEvent, uploadHandler);
          }
        }
        return false;
      },
    },
    onUpdate: ({ editor }) => {
      setSaveStatus('Unsaved');
      debouncedUpdates(editor);
    },
  });

  if (!editor) {
    return null;
  }

  return (
    <div className="relative w-full">
      {/* Save status and word count */}
      <div className="absolute right-5 top-5 z-10 mb-5 flex gap-2">
        <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">{saveStatus}</div>
        {wordCount > 0 && (
          <div className="rounded-lg bg-accent px-2 py-1 text-sm text-muted-foreground">
            {wordCount} {wordCount === 1 ? 'Word' : 'Words'}
          </div>
        )}
      </div>

      {/* Floating toolbar */}
      <div className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="flex items-center gap-1 p-1">
          <NodeSelector editor={editor} isOpen={openNode} setIsOpen={setOpenNode} />
          <Separator orientation="vertical" className="h-8" />
          <LinkSelector editor={editor} isOpen={openLink} setIsOpen={setOpenLink} />
          <Separator orientation="vertical" className="h-8" />
          <TextButtons editor={editor} />
          <Separator orientation="vertical" className="h-8" />
          <ColorSelector editor={editor} isOpen={openColor} setIsOpen={setOpenColor} />
        </div>
      </div>

      {/* Editor content */}
      <div className="w-full rounded-lg border border-muted bg-background shadow-sm">
        <EditorContent editor={editor} className={className} />
      </div>
    </div>
  );
}

export default Editor;
