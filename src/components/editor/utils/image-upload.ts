import type { Editor } from '@tiptap/react';

interface ImageUploadOptions {
  validateFn?: (file: File) => boolean;
  onUpload?: (file: File) => Promise<string>;
}

/**
 * Handle image upload with validation and drag-and-drop support
 */
export const handleImageUpload = async (
  file: File,
  editor: Editor,
  options?: ImageUploadOptions
): Promise<void> => {
  const { validateFn, onUpload } = options || {};

  // Validate file type
  if (!file.type.includes('image/')) {
    throw new Error('File type not supported. Please upload an image.');
  }

  // Validate file size (max 20MB)
  if (file.size / 1024 / 1024 > 20) {
    throw new Error('File size too big. Max size is 20MB.');
  }

  // Custom validation
  if (validateFn && !validateFn(file)) {
    throw new Error('Validation failed.');
  }

  let imageUrl: string;

  if (onUpload) {
    // Use custom upload handler
    imageUrl = await onUpload(file);
  } else {
    // Default: create object URL
    imageUrl = URL.createObjectURL(file);
  }

  // Insert image into editor
  editor.chain().focus().setImage({ src: imageUrl }).run();
};

/**
 * Handle image drop event
 */
export const handleImageDrop = (
  view: any,
  event: DragEvent,
  moved: boolean,
  uploadHandler: (file: File, editor: any) => void
): boolean => {
  if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
    const file = event.dataTransfer.files[0];
    const pos = view.state.selection.from;

    if (file.type.includes('image/')) {
      uploadHandler(file, { view, state: view.state, pos });
      return true;
    }
  }

  return false;
};

/**
 * Handle image paste event
 */
export const handleImagePaste = (
  view: any,
  event: ClipboardEvent,
  uploadHandler: (file: File, editor: any) => void
): boolean => {
  if (event.clipboardData && event.clipboardData.files && event.clipboardData.files[0]) {
    const file = event.clipboardData.files[0];

    if (file.type.includes('image/')) {
      const pos = view.state.selection.from;
      uploadHandler(file, { view, state: view.state, pos });
      return true;
    }
  }

  return false;
};

/**
 * Create image upload handler for use with Tiptap editor
 */
export const createImageUploadHandler = (editor: Editor, options?: ImageUploadOptions) => {
  return async (file: File) => {
    try {
      await handleImageUpload(file, editor, options);
    } catch (error) {
      console.error('Image upload failed:', error);
      // You can add toast notification here
      throw error;
    }
  };
};
