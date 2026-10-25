"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import {
  useEditor,
  EditorContent,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  type NodeViewProps,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import { Icon } from "../admin-icons";

/* ═══════════════════════════════════════════════════════════════════════════
   NODE VIEW GAMBAR INTERAKTIF: RESIZE DRAG + PRESET 25/50/75/100% + ALIGNMENT
   ═══════════════════════════════════════════════════════════════════════════ */

function ResizableImageNodeView({
  node,
  updateAttributes,
  deleteNode,
  selected,
}: NodeViewProps) {
  const { src, alt, width = "100%", alignment = "center" } = node.attrs;
  const [hovered, setHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDragStart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const startX = e.clientX;
    const parent = containerRef.current?.parentElement;
    const parentWidth = parent ? parent.clientWidth : 700;
    const currentWidthPx = containerRef.current?.offsetWidth || parentWidth;

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const targetWidth = Math.max(120, Math.min(parentWidth, currentWidthPx + deltaX));
      const percent = Math.round((targetWidth / parentWidth) * 100);
      updateAttributes({ width: `${percent}%` });
    };

    const onMouseUp = () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const alignClass =
    alignment === "left"
      ? "mr-auto ml-0"
      : alignment === "right"
      ? "ml-auto mr-0"
      : "mx-auto";

  return (
    <NodeViewWrapper
      className={`relative my-4 transition-all block ${alignClass}`}
      style={{ width, maxWidth: "100%" }}
    >
      <div
        ref={containerRef}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`group relative rounded-2xl transition-all duration-150 ${
          selected || hovered
            ? "ring-2 ring-amber-500 ring-offset-2 ring-offset-amber-50/50"
            : ""
        }`}
      >
        {/* Floating Quick Action Bar when selected or hovered */}
        {(hovered || selected) && (
          <div
            className="absolute -top-11 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1 bg-[#241e12]/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-lg border border-amber-400/40 text-white text-[11px] font-semibold whitespace-nowrap"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Width Presets */}
            <span className="text-[10px] text-amber-300 font-bold uppercase mr-1">
              Ukuran:
            </span>
            {(["25%", "50%", "75%", "100%"] as const).map((sz) => (
              <button
                key={sz}
                type="button"
                onClick={() => updateAttributes({ width: sz })}
                className={`px-1.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                  width === sz
                    ? "bg-amber-400 text-amber-950 font-bold"
                    : "hover:bg-white/20 text-white/90"
                }`}
              >
                {sz}
              </button>
            ))}

            <span className="w-px h-3.5 bg-white/30 mx-1" />

            {/* Alignment */}
            <span className="text-[10px] text-amber-300 font-bold uppercase mr-1">
              Posisi:
            </span>
            {(
              [
                { id: "left", label: "Kiri" },
                { id: "center", label: "Tengah" },
                { id: "right", label: "Kanan" },
              ] as const
            ).map((al) => (
              <button
                key={al.id}
                type="button"
                onClick={() => updateAttributes({ alignment: al.id })}
                className={`px-1.5 py-0.5 rounded-md transition-colors cursor-pointer ${
                  alignment === al.id
                    ? "bg-amber-400 text-amber-950 font-bold"
                    : "hover:bg-white/20 text-white/90"
                }`}
              >
                {al.label}
              </button>
            ))}

            <span className="w-px h-3.5 bg-white/30 mx-1" />

            {/* Delete button */}
            <button
              type="button"
              title="Hapus Gambar"
              onClick={() => deleteNode()}
              className="p-1 text-rose-300 hover:text-white hover:bg-rose-600 rounded-md transition-colors cursor-pointer"
            >
              <Icon name="trash" size={12} />
            </button>
          </div>
        )}

        {/* The Image Element */}
        <img
          src={src}
          alt={alt || "Gambar artikel"}
          className="w-full h-auto rounded-2xl block border border-amber-200/80 shadow-sm"
        />

        {/* Drag-to-resize handle (bottom right) */}
        {(hovered || selected) && (
          <div
            onMouseDown={handleDragStart}
            title="Tarik sudut ini untuk mengubah ukuran gambar secara bebas"
            className="absolute -bottom-2 -right-2 w-5 h-5 rounded-full bg-amber-500 border-2 border-white shadow-md cursor-nwse-resize z-20 flex items-center justify-center hover:scale-125 transition-transform"
          >
            <span className="w-1.5 h-1.5 bg-white rounded-full pointer-events-none" />
          </div>
        )}
      </div>
    </NodeViewWrapper>
  );
}

const CustomResizableImage = Image.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: "100%",
        parseHTML: (element) =>
          element.getAttribute("data-width") ||
          element.style.width ||
          "100%",
        renderHTML: (attributes) => ({
          "data-width": attributes.width,
          style: `width: ${attributes.width}; max-width: 100%; height: auto;`,
        }),
      },
      alignment: {
        default: "center",
        parseHTML: (element) =>
          element.getAttribute("data-alignment") || "center",
        renderHTML: (attributes) => ({
          "data-alignment": attributes.alignment,
          class:
            attributes.alignment === "left"
              ? "mr-auto ml-0 block my-4"
              : attributes.alignment === "right"
              ? "ml-auto mr-0 block my-4"
              : "mx-auto block my-4",
        }),
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ResizableImageNodeView);
  },
});

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN RICH TEXT EDITOR COMPONENT
   ═══════════════════════════════════════════════════════════════════════════ */

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
  const imageInputRef = useRef<HTMLInputElement | null>(null);

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
      CustomResizableImage.configure({
        inline: false,
        allowBase64: true,
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
      // Mendukung seret & lepas (Drag & Drop) gambar langsung ke dalam editor
      handleDrop: (view, event, _slice, moved) => {
        if (!moved && event.dataTransfer?.files?.[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault();
            const reader = new FileReader();
            reader.onload = (e) => {
              const src = e.target?.result as string;
              if (src) {
                const node = view.state.schema.nodes.image.create({
                  src,
                  alt: file.name,
                });
                const coordinates = view.posAtCoords({
                  left: event.clientX,
                  top: event.clientY,
                });
                const tr = view.state.tr.insert(
                  coordinates?.pos ?? view.state.selection.from,
                  node
                );
                view.dispatch(tr);
              }
            };
            reader.readAsDataURL(file);
            return true;
          }
        }
        return false;
      },
      // Mendukung Paste gambar langsung dari clipboard (Ctrl+V screenshot / copy gambar)
      handlePaste: (view, event) => {
        const items = event.clipboardData?.items;
        if (items) {
          for (let i = 0; i < items.length; i++) {
            if (items[i].type.startsWith("image/")) {
              const file = items[i].getAsFile();
              if (file) {
                event.preventDefault();
                const reader = new FileReader();
                reader.onload = (e) => {
                  const src = e.target?.result as string;
                  if (src) {
                    const node = view.state.schema.nodes.image.create({
                      src,
                      alt: file.name,
                    });
                    const tr = view.state.tr.replaceSelectionWith(node);
                    view.dispatch(tr);
                  }
                };
                reader.readAsDataURL(file);
                return true;
              }
            }
          }
        }
        return false;
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

  // Upload gambar dari komputer
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editor) return;

    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      const src = uploadEvent.target?.result as string;
      if (src) {
        editor.chain().focus().setImage({ src, alt: file.name }).run();
      }
    };
    reader.readAsDataURL(file);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // Pilihan sisipkan gambar: pilih file atau masukkan URL
  const promptImage = () => {
    if (!editor) return;
    const choice = window.confirm(
      "Klik [OK] untuk mengunggah gambar dari komputer Anda,\natau [Batal] untuk memasukkan URL gambar web."
    );

    if (choice) {
      imageInputRef.current?.click();
    } else {
      const url = window.prompt("Masukkan URL Gambar Web (https://...):");
      if (url) {
        editor.chain().focus().setImage({ src: url }).run();
      }
    }
  };

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

      {/* Hidden file input untuk upload gambar langsung dari komputer */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageUpload}
      />

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

          {/* Quote, Link, Image */}
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
            title="Sisipkan Gambar (Upload dari Komputer / URL)"
            onClick={promptImage}
            className={`${btnBase} ${
              editor.isActive("image") ? btnActive : btnInactive
            }`}
          >
            <Icon name="image" size={14} />
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
