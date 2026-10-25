"use client";

import React, { useEffect, useCallback } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { Icon } from "../admin-icons";

export interface RichTextEditorProps {
  label?: string;
  required?: boolean;
  value?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  minHeight?: number | string;
  className?: string;
  onChange?: (html: string) => void;
}

export function RichTextEditor({
  label,
  required,
  value = "",
  placeholder = "Mulai menulis isi konten di sini...",
  helperText,
  error,
  minHeight = 220,
  className = "",
  onChange,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-amber-700 underline font-semibold hover:text-amber-900",
          target: "_blank",
          rel: "noopener noreferrer",
        },
      }),
    ],
    content: value,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm sm:prose-base max-w-none focus:outline-none p-4 text-[#2d2410] leading-relaxed",
        style: `min-height: ${
          typeof minHeight === "number" ? `${minHeight}px` : minHeight
        };`,
      },
    },
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      onChange?.(html);
    },
  });

  // Sync external value changes (e.g. when opening edit modal)
  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (value !== currentHtml && (value || currentHtml !== "<p></p>")) {
      editor.commands.setContent(value || "");
    }
  }, [value, editor]);

  const setLink = useCallback(() => {
    if (!editor) return;
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("Masukkan URL Tautan:", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url })
      .run();
  }, [editor]);

  if (!editor) {
    return (
      <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
        {label && (
          <label className="text-xs font-semibold text-[#7d7152] flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div
          className="w-full rounded-2xl border border-[#efe3c2] bg-white/70 animate-pulse p-4"
          style={{
            minHeight:
              typeof minHeight === "number" ? `${minHeight}px` : minHeight,
          }}
        >
          <span className="text-xs text-slate-400">Memuat editor...</span>
        </div>
      </div>
    );
  }

  const btnBase =
    "p-1.5 rounded-lg text-xs font-semibold transition-all flex items-center justify-center cursor-pointer";
  const btnActive = "bg-amber-400/30 text-amber-950 font-bold shadow-xs";
  const btnInactive = "text-[#6b5f41] hover:bg-amber-100/60 hover:text-[#2d2410]";

  return (
    <div className={`flex flex-col gap-1.5 w-full text-left ${className}`}>
      {label && (
        <label className="text-xs font-semibold text-[#7d7152] flex items-center gap-1">
          {label}
          {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div
        className={`w-full rounded-2xl overflow-hidden border bg-white/90 backdrop-blur transition-all duration-150 shadow-xs ${
          error
            ? "border-red-500 ring-2 ring-red-100"
            : "border-[#efe3c2] focus-within:border-[#f5b82e] focus-within:ring-3 focus-within:ring-[#f5b82e]/20"
        }`}
      >
        {/* ── Toolbar Menu ── */}
        <div className="flex flex-wrap items-center gap-1 px-3 py-2 border-b border-[#efe3c2]/80 bg-amber-50/40 select-none">
          {/* Headings */}
          <button
            type="button"
            title="Paragraf Biasa"
            onClick={() => editor.chain().focus().setParagraph().run()}
            className={`${btnBase} px-2 ${
              editor.isActive("paragraph") && !editor.isActive("heading")
                ? btnActive
                : btnInactive
            }`}
          >
            P
          </button>
          <button
            type="button"
            title="Judul 1 (H1)"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 1 }).run()
            }
            className={`${btnBase} px-2 font-bold ${
              editor.isActive("heading", { level: 1 }) ? btnActive : btnInactive
            }`}
          >
            H1
          </button>
          <button
            type="button"
            title="Judul 2 (H2)"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 2 }).run()
            }
            className={`${btnBase} px-2 font-bold ${
              editor.isActive("heading", { level: 2 }) ? btnActive : btnInactive
            }`}
          >
            H2
          </button>
          <button
            type="button"
            title="Subjudul (H3)"
            onClick={() =>
              editor.chain().focus().toggleHeading({ level: 3 }).run()
            }
            className={`${btnBase} px-2 font-bold ${
              editor.isActive("heading", { level: 3 }) ? btnActive : btnInactive
            }`}
          >
            H3
          </button>

          <span className="w-px h-4 bg-amber-200/80 mx-1" aria-hidden="true" />

          {/* Formats: Bold, Italic, Underline, Strike */}
          <button
            type="button"
            title="Tebal (Ctrl+B)"
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`${btnBase} ${
              editor.isActive("bold") ? btnActive : btnInactive
            }`}
          >
            <Icon name="bold" size={14} />
          </button>
          <button
            type="button"
            title="Miring (Ctrl+I)"
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`${btnBase} ${
              editor.isActive("italic") ? btnActive : btnInactive
            }`}
          >
            <Icon name="italic" size={14} />
          </button>
          <button
            type="button"
            title="Garis Bawah (Ctrl+U)"
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`${btnBase} ${
              editor.isActive("underline") ? btnActive : btnInactive
            }`}
          >
            <Icon name="underline" size={14} />
          </button>
          <button
            type="button"
            title="Coret"
            onClick={() => editor.chain().focus().toggleStrike().run()}
            className={`${btnBase} line-through px-1.5 ${
              editor.isActive("strike") ? btnActive : btnInactive
            }`}
          >
            S
          </button>

          <span className="w-px h-4 bg-amber-200/80 mx-1" aria-hidden="true" />

          {/* Lists */}
          <button
            type="button"
            title="Daftar Poin (Bullet)"
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`${btnBase} ${
              editor.isActive("bulletList") ? btnActive : btnInactive
            }`}
          >
            <Icon name="list" size={14} />
          </button>
          <button
            type="button"
            title="Daftar Angka (Nomor)"
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            className={`${btnBase} ${
              editor.isActive("orderedList") ? btnActive : btnInactive
            }`}
          >
            <Icon name="list-ordered" size={14} />
          </button>

          <span className="w-px h-4 bg-amber-200/80 mx-1" aria-hidden="true" />

          {/* Quote & Link */}
          <button
            type="button"
            title="Kutipan (Blockquote)"
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`${btnBase} ${
              editor.isActive("blockquote") ? btnActive : btnInactive
            }`}
          >
            <Icon name="quote" size={14} />
          </button>
          <button
            type="button"
            title="Sisipkan Tautan Web"
            onClick={setLink}
            className={`${btnBase} ${
              editor.isActive("link") ? btnActive : btnInactive
            }`}
          >
            <Icon name="link" size={14} />
          </button>
          <button
            type="button"
            title="Garis Pemisah (Horizontal Rule)"
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            className={`${btnBase} px-1.5`}
          >
            ―
          </button>

          <span className="w-px h-4 bg-amber-200/80 mx-1" aria-hidden="true" />

          {/* Undo / Redo */}
          <button
            type="button"
            title="Urungkan (Undo)"
            disabled={!editor.can().undo()}
            onClick={() => editor.chain().focus().undo().run()}
            className={`${btnBase} ${btnInactive} disabled:opacity-30 disabled:pointer-events-none`}
          >
            <Icon name="undo" size={13} />
          </button>
          <button
            type="button"
            title="Ulangi (Redo)"
            disabled={!editor.can().redo()}
            onClick={() => editor.chain().focus().redo().run()}
            className={`${btnBase} ${btnInactive} disabled:opacity-30 disabled:pointer-events-none`}
          >
            <Icon name="redo" size={13} />
          </button>
        </div>

        {/* ── Content Editable Area ── */}
        <div className="relative cursor-text" onClick={() => editor.commands.focus()}>
          <EditorContent editor={editor} />
          {editor.isEmpty && (
            <div className="absolute top-4 left-4 text-sm text-slate-400 pointer-events-none select-none">
              {placeholder}
            </div>
          )}
        </div>
      </div>

      {error && <span className="text-xs text-red-600 font-medium">{error}</span>}
      {helperText && !error && (
        <span className="text-xs text-[#7d7152]">{helperText}</span>
      )}
    </div>
  );
}
