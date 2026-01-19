"use client";

import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";

import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BubbleMenu, FloatingMenu } from "@tiptap/react/menus";
import "./tiptap.css";
import { Button } from "../ui/button";
import { editorBtn } from "./editor-btn";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Strikethrough,
  Code,
  Highlighter,
  Link as LinkIcon,
} from "lucide-react";
const Tiptap = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      Underline,
      Subscript,
      Superscript,
      Typography,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      Placeholder.configure({
        placeholder: "Mulai menulis…",
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "<p>Hello World! 🌎️</p>",
    immediatelyRender: false,
  });

  if (!editor) return null;

  return (
    <>
      <BubbleMenu
        editor={editor}
        className="flex items-center gap-1 rounded-lg border bg-background shadow-md px-1 py-1"
      >
        <Button
          {...editorBtn(editor.isActive("bold"))}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold />
        </Button>

        <Button
          {...editorBtn(editor.isActive("italic"))}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic />
        </Button>

        <Button
          {...editorBtn(editor.isActive("underline"))}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <UnderlineIcon />
        </Button>

        <Button
          {...editorBtn(editor.isActive("strike"))}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough />
        </Button>

        <Button
          {...editorBtn(editor.isActive("code"))}
          onClick={() => editor.chain().focus().toggleCode().run()}
        >
          <Code />
        </Button>

        <Button
          {...editorBtn(editor.isActive("highlight"))}
          onClick={() => editor.chain().focus().toggleHighlight().run()}
        >
          <Highlighter />
        </Button>

        <div className="mx-1 h-5 w-px bg-border" />

        <Button
          {...editorBtn(editor.isActive("link"))}
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href;
            const url = window.prompt("Masukkan URL", previousUrl);

            if (url === null) return;
            if (url === "") {
              editor.chain().focus().unsetLink().run();
              return;
            }

            editor.chain().focus().setLink({ href: url }).run();
          }}
        >
          <LinkIcon />
        </Button>

        {/* <Button */}
        {/*   variant="editor" */}
        {/*   size="editor" */}
        {/*   onClick={() => editor.chain().focus().clearMarks().run()} */}
        {/* > */}
        {/*   <RemoveFormatting /> */}
        {/* </Button> */}
      </BubbleMenu>
      <FloatingMenu className="floating-menu" editor={editor}>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 }) ? "is-active" : ""
          }
        >
          H1
        </button>
        <button
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 }) ? "is-active" : ""
          }
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          Bullet list
        </button>
      </FloatingMenu>
      <EditorContent editor={editor} />
    </>
  );
};

export default Tiptap;
