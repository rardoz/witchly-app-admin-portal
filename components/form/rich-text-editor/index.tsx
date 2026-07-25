"use client";

import { Node } from "@tiptap/core";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import { Color } from "@tiptap/extension-color";
import DragHandle from "@tiptap/extension-drag-handle-react";
import FontFamily from "@tiptap/extension-font-family";
import Heading from "@tiptap/extension-heading";
import Highlight from "@tiptap/extension-highlight";
import BaseImage from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import ListItem from "@tiptap/extension-list-item";
import OrderedList from "@tiptap/extension-ordered-list";
import Paragraph from "@tiptap/extension-paragraph";
import {
  Table,
  TableCell,
  TableHeader,
  TableRow,
} from "@tiptap/extension-table";
import TextAlign from "@tiptap/extension-text-align";
import {
  BackgroundColor,
  FontSize,
  TextStyle,
} from "@tiptap/extension-text-style";
import Underline from "@tiptap/extension-underline";
import type { NodeViewProps } from "@tiptap/react";
import {
  EditorContent,
  mergeAttributes,
  NodeViewWrapper,
  ReactNodeViewRenderer,
  useEditor,
} from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useRef, useState } from "react";
import {
  FaAlignCenter,
  FaAlignJustify,
  FaAlignLeft,
  FaAlignRight,
  FaBold,
  FaCode,
  FaCompress,
  FaExpand,
  FaGripVertical,
  FaHighlighter,
  FaImage,
  FaItalic,
  FaLink,
  FaListOl,
  FaListUl,
  FaQuoteLeft,
  FaRedo,
  FaRemoveFormat,
  FaStrikethrough,
  FaTable,
  FaUnderline,
  FaUndo,
} from "react-icons/fa";
import FormAssetModal from "@/components/form/form-asset-modal";
import "./styles.css";
import { FONT_FAMILIES } from "../form-font";

// ---------------------------------------------------------------------------
// ImageNodeView
// ---------------------------------------------------------------------------

const ImageNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  const { src, alt, title, width, align } = node.attrs as {
    src: string;
    alt?: string;
    title?: string;
    width?: string | null;
    align?: string | null;
  };

  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    side: "left" | "right";
    startX: number;
    startWidth: number;
  } | null>(null);

  const handleMouseDown = (e: React.MouseEvent, side: "left" | "right") => {
    e.preventDefault();
    e.stopPropagation();
    if (!containerRef.current) return;

    dragRef.current = {
      side,
      startX: e.clientX,
      startWidth: containerRef.current.offsetWidth,
    };

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragRef.current || !containerRef.current) return;
      const { side: s, startX, startWidth } = dragRef.current;
      const delta = s === "right" ? ev.clientX - startX : startX - ev.clientX;
      const newWidthPx = Math.max(50, startWidth + delta);
      const editorEl = containerRef.current.closest(
        ".ProseMirror",
      ) as HTMLElement | null;
      const containerWidth = editorEl?.clientWidth ?? 800;
      const pct = Math.min(
        100,
        Math.round((newWidthPx / containerWidth) * 100),
      );
      updateAttributes({ width: `${pct}%` });
    };

    const onMouseUp = () => {
      dragRef.current = null;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const outerStyle: React.CSSProperties = { display: "block" };
  const innerStyle: React.CSSProperties = { position: "relative" };

  if (align === "left") {
    outerStyle.float = "left";
    outerStyle.margin = "0 1rem 1rem 0";
    innerStyle.display = "block";
    if (width) {
      outerStyle.width = width;
      innerStyle.width = "100%";
    }
  } else if (align === "right") {
    outerStyle.float = "right";
    outerStyle.margin = "0 0 1rem 1rem";
    innerStyle.display = "block";
    if (width) {
      outerStyle.width = width;
      innerStyle.width = "100%";
    }
  } else if (align === "center") {
    outerStyle.textAlign = "center";
    outerStyle.margin = "1rem 0";
    innerStyle.display = "inline-block";
    innerStyle.width = width ?? undefined;
  } else {
    innerStyle.display = "block";
    innerStyle.width = width ?? undefined;
  }

  const isFloated = align === "left" || align === "right";
  const imgStyle: React.CSSProperties = {
    display: "block",
    // Floated images without an explicit width: use intrinsic size so the float
    // shrinks to the image and text can wrap beside it.
    width: isFloated && !width ? "auto" : "100%",
    ...(selected
      ? {
          outline: "2px solid #a855f7",
          outlineOffset: "2px",
          borderRadius: "2px",
        }
      : {}),
  };

  return (
    <NodeViewWrapper style={outerStyle} contentEditable={false}>
      <div ref={containerRef} style={innerStyle}>
        {/* biome-ignore lint/performance/noImgElement: tiptap node view */}
        <img
          src={src}
          alt={alt ?? ""}
          title={title}
          style={imgStyle}
          draggable={false}
        />
        {selected && (
          <>
            <ResizeHandle side="left" onMouseDown={handleMouseDown} />
            <ResizeHandle side="right" onMouseDown={handleMouseDown} />
          </>
        )}
      </div>
    </NodeViewWrapper>
  );
};

const ResizeHandle = ({
  side,
  onMouseDown,
}: {
  side: "left" | "right";
  onMouseDown: (e: React.MouseEvent, side: "left" | "right") => void;
}) => (
  <button
    type="button"
    aria-label={`Resize ${side}`}
    onMouseDown={(e) => onMouseDown(e, side)}
    style={{
      position: "absolute",
      [side]: -6,
      top: "50%",
      transform: "translateY(-50%)",
      width: 12,
      height: 32,
      backgroundColor: "#a855f7",
      borderRadius: 4,
      cursor: "ew-resize",
      zIndex: 10,
      userSelect: "none",
      border: "none",
      padding: 0,
    }}
  />
);

// ---------------------------------------------------------------------------
// ResizableImage extension
// ---------------------------------------------------------------------------

const ResizableImage = BaseImage.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      width: {
        default: null,
        parseHTML: (el) => el.getAttribute("width") || el.style.width || null,
        renderHTML: (attrs) =>
          attrs.width ? { style: `width: ${attrs.width}` } : {},
      },
      align: {
        default: null,
        parseHTML: (el) => el.getAttribute("data-align") || null,
        renderHTML: (attrs) => {
          if (!attrs.align) return {};
          const styles: Record<string, string> = {
            left: "float: left; margin: 0 1rem 1rem 0",
            center: "display: block; margin: 1rem auto",
            right: "float: right; margin: 0 0 1rem 1rem",
          };
          return {
            style: styles[attrs.align] ?? "",
            "data-align": attrs.align,
          };
        },
      },
    };
  },
  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView);
  },
});

// ---------------------------------------------------------------------------
// Custom typography nodes — inline styles baked into renderHTML so the
// stored HTML is self-contained and renders correctly without any stylesheet.
// ---------------------------------------------------------------------------

const HEADING_STYLES: Record<number, string> = {
  1: "font-size: 2em; font-weight: bold; margin: 0.83em 0; line-height: 1.2;",
  2: "font-size: 1.5em; font-weight: bold; margin: 0.75em 0; line-height: 1.3;",
  3: "font-size: 1.17em; font-weight: bold; margin: 0.83em 0; line-height: 1.4;",
  4: "font-size: 1em; font-weight: bold; margin: 1em 0;",
  5: "font-size: 0.875em; font-weight: bold; margin: 1em 0;",
  6: "font-size: 0.75em; font-weight: bold; margin: 1em 0;",
};

const CustomHeading = Heading.extend({
  renderHTML({ node, HTMLAttributes }) {
    const level = node.attrs.level as 1 | 2 | 3 | 4 | 5 | 6;
    return [
      `h${level}`,
      mergeAttributes({ style: HEADING_STYLES[level] }, HTMLAttributes),
      0,
    ];
  },
});

const CustomParagraph = Paragraph.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "p",
      mergeAttributes({ style: "margin: 0.75em 0;" }, HTMLAttributes),
      0,
    ];
  },
});

const CustomBulletList = BulletList.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "ul",
      mergeAttributes(
        {
          style:
            "list-style-type: disc; padding-left: 1.5em; margin: 0.75em 0;",
        },
        HTMLAttributes,
      ),
      0,
    ];
  },
});

const CustomOrderedList = OrderedList.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "ol",
      mergeAttributes(
        {
          style:
            "list-style-type: decimal; padding-left: 1.5em; margin: 0.75em 0;",
        },
        HTMLAttributes,
      ),
      0,
    ];
  },
});

const CustomListItem = ListItem.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "li",
      mergeAttributes({ style: "margin: 0.25em 0;" }, HTMLAttributes),
      0,
    ];
  },
});

const CustomBlockquote = Blockquote.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "blockquote",
      mergeAttributes(
        {
          style:
            "border-left: 4px solid #52525b; padding-left: 1em; margin: 1em 0; font-style: italic;",
        },
        HTMLAttributes,
      ),
      0,
    ];
  },
});

const CustomCodeBlock = CodeBlock.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "pre",
      mergeAttributes(
        {
          style:
            "background-color: #18181b; padding: 1em; border-radius: 4px; overflow-x: auto; margin: 1em 0;",
        },
        HTMLAttributes,
      ),
      [
        "code",
        {
          style:
            "background-color: transparent; padding: 0; font-family: monospace;",
        },
        0,
      ],
    ];
  },
});

const CustomCode = Code.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "code",
      mergeAttributes(
        {
          style:
            "font-family: monospace; background-color: #27272a; padding: 2px 4px; border-radius: 3px; font-size: 0.875em;",
        },
        HTMLAttributes,
      ),
    ];
  },
});

// ---------------------------------------------------------------------------
// Custom table cell extensions (cell bg, horizontal + vertical alignment)
// ---------------------------------------------------------------------------

const cellExtraAttrs = {
  backgroundColor: {
    default: null,
    // biome-ignore lint/suspicious/noExplicitAny: tiptap attribute schema
    parseHTML: (el: any) => el.getAttribute("data-cell-bg") || null,
    // biome-ignore lint/suspicious/noExplicitAny: tiptap attribute schema
    renderHTML: (attrs: any) =>
      attrs.backgroundColor
        ? {
            "data-cell-bg": attrs.backgroundColor,
            style: `background-color: ${attrs.backgroundColor}`,
          }
        : {},
  },
  textAlign: {
    default: null,
    // biome-ignore lint/suspicious/noExplicitAny: tiptap attribute schema
    parseHTML: (el: any) => el.getAttribute("data-cell-align") || null,
    // biome-ignore lint/suspicious/noExplicitAny: tiptap attribute schema
    renderHTML: (attrs: any) =>
      attrs.textAlign
        ? {
            "data-cell-align": attrs.textAlign,
            style: `text-align: ${attrs.textAlign}`,
          }
        : {},
  },
  verticalAlign: {
    default: null,
    // biome-ignore lint/suspicious/noExplicitAny: tiptap attribute schema
    parseHTML: (el: any) => el.getAttribute("data-cell-valign") || null,
    // biome-ignore lint/suspicious/noExplicitAny: tiptap attribute schema
    renderHTML: (attrs: any) =>
      attrs.verticalAlign
        ? {
            "data-cell-valign": attrs.verticalAlign,
            style: `vertical-align: ${attrs.verticalAlign}`,
          }
        : {},
  },
  borderColor: {
    default: null,
    // biome-ignore lint/suspicious/noExplicitAny: tiptap attribute schema
    parseHTML: (el: any) => el.getAttribute("data-cell-border") || null,
    // biome-ignore lint/suspicious/noExplicitAny: tiptap attribute schema
    renderHTML: (attrs: any) =>
      attrs.borderColor
        ? {
            "data-cell-border": attrs.borderColor,
            style: `border-color: ${attrs.borderColor}`,
          }
        : {},
  },
};

const CustomTableCell = TableCell.extend({
  addAttributes() {
    return { ...this.parent?.(), ...cellExtraAttrs };
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "td",
      mergeAttributes(
        {
          style:
            "border: 2px solid #3f3f46; padding: 6px 8px; vertical-align: top; box-sizing: border-box; position: relative; min-width: 1em;",
        },
        HTMLAttributes,
      ),
      0,
    ];
  },
});

const CustomTableHeader = TableHeader.extend({
  addAttributes() {
    return { ...this.parent?.(), ...cellExtraAttrs };
  },
  renderHTML({ HTMLAttributes }) {
    return [
      "th",
      mergeAttributes(
        {
          style:
            "border: 2px solid #3f3f46; padding: 6px 8px; vertical-align: top; box-sizing: border-box; position: relative; min-width: 1em; font-weight: bold; background-color: #27272a;",
        },
        HTMLAttributes,
      ),
      0,
    ];
  },
});

const CustomTable = Table.extend({
  renderHTML({ HTMLAttributes }) {
    return [
      "table",
      mergeAttributes(
        {
          style:
            "border-collapse: collapse; table-layout: fixed; width: 100%; overflow: hidden;",
        },
        HTMLAttributes,
      ),
      ["tbody", 0],
    ];
  },
}).configure({ resizable: true });

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  name: string;
  backgroundColor?: string;
  font?: string;
  textColor?: string;
  primaryColor?: string;
}

const FONT_SIZES = [
  "10px",
  "12px",
  "14px",
  "16px",
  "18px",
  "20px",
  "24px",
  "28px",
  "32px",
  "36px",
  "48px",
];
const WIDTH_PRESETS = ["25%", "50%", "75%", "100%"];

const ToolbarButton = ({
  onClick,
  active,
  title,
  children,
  danger,
}: {
  onClick: () => void;
  active?: boolean;
  title: string;
  children: React.ReactNode;
  danger?: boolean;
}) => (
  <button
    type="button"
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    title={title}
    className={`p-1.5 rounded text-sm transition-colors ${
      danger
        ? "text-red-400 hover:bg-red-900/30 hover:text-red-300"
        : active
          ? "bg-zinc-600 text-white"
          : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
    }`}
  >
    {children}
  </button>
);

const ColorInput = ({
  value,
  onChange,
  title,
  label,
  icon,
}: {
  value: string;
  onChange: (hex: string) => void;
  title: string;
  label?: string;
  icon?: React.ReactNode;
}) => (
  <div title={title} className="flex items-center gap-1 cursor-pointer">
    {label && <span className="text-xs text-zinc-400">{label}</span>}
    {icon}
    <div className="relative w-6 h-6">
      <div
        className="w-full h-full rounded border border-zinc-600"
        style={{ backgroundColor: value || "#ffffff" }}
      />
      <input
        type="color"
        value={value || "#ffffff"}
        onChange={(e) => onChange(e.target.value)}
        className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
      />
    </div>
  </div>
);

// Visual grid picker for table insertion (TableTriggerButton equivalent)
const TableSizePicker = ({
  onInsert,
}: {
  onInsert: (rows: number, cols: number) => void;
}) => {
  const [hovered, setHovered] = useState({ rows: 0, cols: 0 });
  const MAX = 8;

  return (
    // biome-ignore lint/a11y/noStaticElementInteractions: AI chose this
    <div
      onMouseLeave={() => setHovered({ rows: 0, cols: 0 })}
      className="select-none"
    >
      {Array.from({ length: MAX }, (_, r) => (
        <div key={r.toString()} className="flex gap-0.5 mb-0.5">
          {Array.from({ length: MAX }, (_, c) => (
            <button
              key={c.toString()}
              type="button"
              onMouseEnter={() => setHovered({ rows: r + 1, cols: c + 1 })}
              onClick={() => onInsert(r + 1, c + 1)}
              className={`w-5 h-5 rounded-sm border transition-colors ${
                r < hovered.rows && c < hovered.cols
                  ? "bg-indigo-600 border-indigo-500"
                  : "bg-zinc-700 border-zinc-600 hover:bg-zinc-600"
              }`}
            />
          ))}
        </div>
      ))}
      <p className="text-xs text-zinc-400 text-center mt-1.5">
        {hovered.rows > 0 && hovered.cols > 0
          ? `${hovered.cols} × ${hovered.rows}`
          : "Select table size"}
      </p>
    </div>
  );
};

// ---------------------------------------------------------------------------
// StyleBlock node — renders a <style> tag as an editable node in the document
// ---------------------------------------------------------------------------

const StyleBlockNodeView: React.FC<NodeViewProps> = ({
  node,
  updateAttributes,
  selected,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (node.attrs.open) {
      setTimeout(() => textareaRef.current?.focus(), 0);
    }
  }, [node.attrs.open]);

  return (
    <NodeViewWrapper contentEditable={false}>
      <style>{node.attrs.css}</style>
      {node.attrs.open && (
        <div
          className={`my-2 rounded border overflow-hidden ${selected ? "border-purple-500" : "border-zinc-600"}`}
        >
          <div className="bg-zinc-800 px-3 py-1.5 border-b border-zinc-700 flex items-center gap-2">
            <FaCode className="text-zinc-400 text-xs" />
            <span className="text-xs text-zinc-400 font-mono">
              &lt;style&gt;
            </span>
          </div>
          <textarea
            ref={textareaRef}
            value={node.attrs.css}
            onChange={(e) => updateAttributes({ css: e.target.value })}
            placeholder="/* p { color: red; } */"
            className="w-full p-3 bg-zinc-950 text-zinc-100 font-mono text-xs focus:outline-none resize-none min-h-24 placeholder-zinc-600"
            spellCheck={false}
            onMouseDown={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </NodeViewWrapper>
  );
};

const StyleBlock = Node.create({
  name: "styleBlock",
  group: "block",
  atom: true,
  selectable: true,
  draggable: true,

  addAttributes() {
    return {
      css: {
        default: "",
        parseHTML: (el) => el.textContent || "",
        renderHTML: () => ({}),
      },
      open: {
        default: false,
        rendered: false,
      },
    };
  },

  parseHTML() {
    return [{ tag: "style" }];
  },

  renderHTML({ node }) {
    // ProseMirror DOMOutputSpec supports string children (rendered as text nodes)
    // biome-ignore lint/suspicious/noExplicitAny: string child is valid ProseMirror DOMOutputSpec
    return ["style", {}, node.attrs.css || ""] as any;
  },

  addNodeView() {
    return ReactNodeViewRenderer(StyleBlockNodeView);
  },
});

// ---------------------------------------------------------------------------
// RichTextEditor
// ---------------------------------------------------------------------------

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  value,
  onChange,
  name,
  backgroundColor,
  font,
  textColor,
  primaryColor,
}) => {
  const [showImageModal, setShowImageModal] = useState(false);
  const [showTablePicker, setShowTablePicker] = useState(false);
  const tablePickerRef = useRef<HTMLDivElement>(null);

  // Text / inline state
  const [inlineTextColor, setInlineTextColor] = useState(
    textColor || "#ffffff",
  );
  const [highlightColor, setHighlightColor] = useState("#facc15");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [fontSize, setFontSize] = useState("");

  // Image state
  const [isImageSelected, setIsImageSelected] = useState(false);
  const [imageAttrs, setImageAttrs] = useState<{
    align?: string | null;
    width?: string | null;
  }>({});
  const [customWidth, setCustomWidth] = useState("");

  // Table / cell state
  const [isInTable, setIsInTable] = useState(false);
  const [cellBorderColor, setCellBorderColor] = useState("#3f3f46");
  const [cellBgColor, setCellBgColor] = useState("#18181b");
  const [cellTextAlign, setCellTextAlign] = useState("");
  const [cellVerticalAlign, setCellVerticalAlign] = useState("");

  const [fullscreen, setFullscreen] = useState(false);
  const [isStyleBlockOpen, setIsStyleBlockOpen] = useState(false);

  const initialContent = useRef(value);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        paragraph: false,
        bulletList: false,
        orderedList: false,
        listItem: false,
        blockquote: false,
        codeBlock: false,
        code: false,
      }),
      CustomHeading,
      CustomParagraph,
      CustomBulletList,
      CustomOrderedList,
      CustomListItem,
      CustomBlockquote,
      CustomCodeBlock,
      CustomCode,
      Underline,
      TextStyle,
      Color,
      BackgroundColor,
      FontSize,
      FontFamily,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      ResizableImage.configure({ inline: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      StyleBlock,
      CustomTable,
      TableRow,
      CustomTableCell,
      CustomTableHeader,
    ],
    content: initialContent.current,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    onTransaction: ({ editor }) => {
      const imageActive = editor.isActive("image");
      setIsImageSelected(imageActive);
      if (imageActive) setImageAttrs(editor.getAttributes("image"));

      const inCell = editor.isActive("tableCell");
      const inHeader = editor.isActive("tableHeader");
      setIsInTable(inCell || inHeader);

      const textAttrs = editor.getAttributes("textStyle");
      setInlineTextColor(textAttrs.color || "#ffffff");
      setBgColor(textAttrs.backgroundColor || "#ffffff");
      setFontSize(textAttrs.fontSize || "");

      const activeHighlight = editor.getAttributes("highlight").color;
      if (activeHighlight) setHighlightColor(activeHighlight);

      let styleOpen = false;
      editor.state.doc.descendants((n) => {
        if (n.type.name === "styleBlock") {
          styleOpen = n.attrs.open;
          return false;
        }
      });
      setIsStyleBlockOpen(styleOpen);

      const cellAttrs = inHeader
        ? editor.getAttributes("tableHeader")
        : inCell
          ? editor.getAttributes("tableCell")
          : null;
      if (cellAttrs) {
        setCellBgColor(cellAttrs.backgroundColor || "#18181b");
        setCellTextAlign(cellAttrs.textAlign || "");
        setCellVerticalAlign(cellAttrs.verticalAlign || "");
        setCellBorderColor(cellAttrs.borderColor || "#3f3f46");
      }
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none min-h-48 p-4 focus:outline-none [&_img]:my-0",
        style: `
          background-color: ${backgroundColor || "#ffffff"};
          font-family: ${font || "inherit"};
          color: ${textColor || "#000000"};
          --tw-prose-links: ${primaryColor || "#2563eb"};
        `,
      },
    },
    immediatelyRender: false,
  });

  useEffect(() => {
    setCustomWidth(imageAttrs.width || "");
  }, [imageAttrs.width]);

  // Close table picker on outside click
  useEffect(() => {
    if (!showTablePicker) return;
    const handler = (e: MouseEvent) => {
      if (
        tablePickerRef.current &&
        !tablePickerRef.current.contains(e.target as Node)
      ) {
        setShowTablePicker(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [showTablePicker]);

  if (!editor) return null;

  const handleInsertLink = () => {
    const url = window.prompt("Enter URL");
    if (url) editor.chain().focus().setLink({ href: url }).run();
  };

  const handleColorChange = (hex: string) => {
    setInlineTextColor(hex);
    const { from, to } = editor.state.selection;
    if (from !== to) {
      editor.chain().focus().setColor(hex).run();
      return;
    }
    const { doc, tr, schema } = editor.state;
    const textStyleType = schema.marks.textStyle;
    if (!textStyleType) return;
    doc.descendants((node, pos) => {
      if (!node.isText) return;
      const existingMark = node.marks.find((m) => m.type === textStyleType);
      if (existingMark?.attrs.color) return;
      const newAttrs = { ...(existingMark?.attrs ?? {}), color: hex };
      if (existingMark) tr.removeMark(pos, pos + node.nodeSize, textStyleType);
      tr.addMark(pos, pos + node.nodeSize, textStyleType.create(newAttrs));
    });
    editor.view.dispatch(tr);
  };

  const updateCellAttr = (attr: string, value: string | null) => {
    editor
      .chain()
      .focus()
      .updateAttributes("tableCell", { [attr]: value })
      .updateAttributes("tableHeader", { [attr]: value })
      .run();
  };

  const applyCustomWidth = () => {
    if (!customWidth.trim()) return;
    editor
      .chain()
      .focus()
      .updateAttributes("image", { width: customWidth.trim() })
      .run();
  };

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-50 flex flex-col bg-zinc-900 border border-zinc-700"
          : "rounded-lg border border-zinc-700 overflow-hidden"
      }
    >
      {/* ── Row 1: text formatting ───────────────────────────────────────── */}
      <div className="bg-zinc-800 border-b border-zinc-700 p-2 flex flex-wrap gap-1">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <FaBold />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <FaItalic />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline"
        >
          <FaUnderline />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          active={editor.isActive("strike")}
          title="Strikethrough"
        >
          <FaStrikethrough />
        </ToolbarButton>

        <span className="w-px bg-zinc-600 mx-1" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          H3
        </ToolbarButton>

        <span className="w-px bg-zinc-600 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <FaListUl />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <FaListOl />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <FaQuoteLeft />
        </ToolbarButton>
      </div>

      {/* ── Row 2: colors, font, alignment, insert, utilities ────────────── */}
      <div className="bg-zinc-800 border-b border-zinc-700 p-2 flex flex-wrap gap-1 items-center">
        <ColorInput
          value={inlineTextColor}
          onChange={handleColorChange}
          title="Text Color"
          label="Color"
        />

        <ColorInput
          value={highlightColor}
          onChange={(hex) => {
            setHighlightColor(hex);
            editor.chain().focus().setHighlight({ color: hex }).run();
          }}
          title="Highlight Color"
          icon={<FaHighlighter className="text-zinc-400 text-xs" />}
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetHighlight().run()}
          title="Remove Highlight"
          active={false}
        >
          <span className="text-xs">No HL</span>
        </ToolbarButton>

        <ColorInput
          value={bgColor}
          onChange={(hex) => {
            setBgColor(hex);
            editor.chain().focus().setBackgroundColor(hex).run();
          }}
          title="Text Background Color"
          label="BG"
        />
        <ToolbarButton
          onClick={() => editor.chain().focus().unsetBackgroundColor().run()}
          title="Remove Text Background"
          active={false}
        >
          <span className="text-xs">No BG</span>
        </ToolbarButton>

        <span className="w-px bg-zinc-600 mx-1" />

        <select
          className="bg-zinc-700 text-zinc-200 text-xs rounded px-2 py-1 border border-zinc-600"
          value={fontSize}
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontSize(e.target.value).run();
            } else {
              editor.chain().focus().unsetFontSize().run();
            }
          }}
        >
          <option value="">Size</option>
          {FONT_SIZES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className="bg-zinc-700 text-zinc-200 text-xs rounded px-2 py-1 border border-zinc-600"
          onChange={(e) => {
            if (e.target.value) {
              editor.chain().focus().setFontFamily(e.target.value).run();
            } else {
              editor.chain().focus().unsetFontFamily().run();
            }
          }}
          defaultValue=""
        >
          <option value="">Font</option>
          {FONT_FAMILIES.map((f) => (
            <option key={f.value} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>

        <span className="w-px bg-zinc-600 mx-1" />

        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          active={editor.isActive({ textAlign: "left" })}
          title="Align Left"
        >
          <FaAlignLeft />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          active={editor.isActive({ textAlign: "center" })}
          title="Align Center"
        >
          <FaAlignCenter />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          active={editor.isActive({ textAlign: "right" })}
          title="Align Right"
        >
          <FaAlignRight />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setTextAlign("justify").run()}
          active={editor.isActive({ textAlign: "justify" })}
          title="Justify"
        >
          <FaAlignJustify />
        </ToolbarButton>

        <span className="w-px bg-zinc-600 mx-1" />

        <ToolbarButton
          onClick={handleInsertLink}
          active={editor.isActive("link")}
          title="Insert Link"
        >
          <FaLink />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setShowImageModal(true)}
          title="Insert Image"
          active={false}
        >
          <FaImage />
        </ToolbarButton>

        {/* Table trigger — visual grid picker */}
        <div ref={tablePickerRef} className="relative">
          <ToolbarButton
            onClick={() => setShowTablePicker((p) => !p)}
            title="Insert Table"
            active={showTablePicker}
          >
            <FaTable />
          </ToolbarButton>
          {showTablePicker && (
            <div className="absolute top-full left-0 mt-1 z-50 bg-zinc-900 border border-zinc-600 rounded-lg shadow-xl p-2.5">
              <TableSizePicker
                onInsert={(rows, cols) => {
                  editor
                    .chain()
                    .focus()
                    .insertTable({ rows, cols, withHeaderRow: true })
                    .run();
                  setShowTablePicker(false);
                }}
              />
            </div>
          )}
        </div>

        <span className="w-px bg-zinc-600 mx-1" />

        <ToolbarButton
          onClick={() =>
            editor.chain().focus().clearNodes().unsetAllMarks().run()
          }
          title="Clear Formatting"
          active={false}
        >
          <FaRemoveFormat />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
          active={false}
        >
          <FaUndo />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
          active={false}
        >
          <FaRedo />
        </ToolbarButton>

        <span className="flex-1" />

        <ToolbarButton
          onClick={() => {
            let existingPos: number | null = null;
            let existingOpen = false;
            editor.state.doc.descendants((n, pos) => {
              if (n.type.name === "styleBlock" && existingPos === null) {
                existingPos = pos;
                existingOpen = n.attrs.open;
                return false;
              }
            });
            if (existingPos !== null) {
              editor
                .chain()
                .setNodeSelection(existingPos)
                .updateAttributes("styleBlock", { open: !existingOpen })
                .run();
            } else {
              editor
                .chain()
                .focus()
                .insertContent({
                  type: "styleBlock",
                  attrs: { css: "", open: true },
                })
                .run();
            }
          }}
          title={isStyleBlockOpen ? "Close Style Block" : "Edit Styles"}
          active={isStyleBlockOpen}
        >
          <FaCode />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => setFullscreen((f) => !f)}
          title={fullscreen ? "Exit fullscreen" : "Fullscreen"}
          active={fullscreen}
        >
          {fullscreen ? <FaCompress /> : <FaExpand />}
        </ToolbarButton>
      </div>

      {/* ── Row 3: table controls ─────────────────────────────────────────── */}
      {isInTable && (
        <div className="bg-zinc-800 border-b border-zinc-700 p-2 flex flex-wrap gap-1 items-center">
          {/* Table border color */}
          <ColorInput
            value={cellBorderColor}
            onChange={(hex) => {
              setCellBorderColor(hex);
              updateCellAttr("borderColor", hex);
            }}
            title="Cell Border Color"
            label="Border"
          />

          <span className="w-px bg-zinc-600 mx-1" />

          {/* Cell background */}
          <ColorInput
            value={cellBgColor}
            onChange={(hex) => {
              setCellBgColor(hex);
              updateCellAttr("backgroundColor", hex);
            }}
            title="Cell Background Color"
            label="Cell BG"
          />
          <ToolbarButton
            onClick={() => {
              setCellBgColor("#18181b");
              updateCellAttr("backgroundColor", null);
            }}
            title="Remove Cell Background"
            active={false}
          >
            <span className="text-xs">No BG</span>
          </ToolbarButton>

          <span className="w-px bg-zinc-600 mx-1" />

          {/* Cell horizontal alignment */}
          <span className="text-xs text-zinc-500">H</span>
          <ToolbarButton
            onClick={() => {
              setCellTextAlign("left");
              updateCellAttr("textAlign", "left");
            }}
            active={cellTextAlign === "left"}
            title="Cell Align Left"
          >
            <FaAlignLeft />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              setCellTextAlign("center");
              updateCellAttr("textAlign", "center");
            }}
            active={cellTextAlign === "center"}
            title="Cell Align Center"
          >
            <FaAlignCenter />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              setCellTextAlign("right");
              updateCellAttr("textAlign", "right");
            }}
            active={cellTextAlign === "right"}
            title="Cell Align Right"
          >
            <FaAlignRight />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              setCellTextAlign("");
              updateCellAttr("textAlign", null);
            }}
            active={!cellTextAlign}
            title="Cell Align Default"
          >
            <FaRemoveFormat />
          </ToolbarButton>

          <span className="w-px bg-zinc-600 mx-1" />

          {/* Cell vertical alignment */}
          <span className="text-xs text-zinc-500">V</span>
          <ToolbarButton
            onClick={() => {
              setCellVerticalAlign("top");
              updateCellAttr("verticalAlign", "top");
            }}
            active={cellVerticalAlign === "top"}
            title="Cell Align Top"
          >
            <span className="text-xs">Top</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              setCellVerticalAlign("middle");
              updateCellAttr("verticalAlign", "middle");
            }}
            active={cellVerticalAlign === "middle"}
            title="Cell Align Middle"
          >
            <span className="text-xs">Mid</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => {
              setCellVerticalAlign("bottom");
              updateCellAttr("verticalAlign", "bottom");
            }}
            active={cellVerticalAlign === "bottom"}
            title="Cell Align Bottom"
          >
            <span className="text-xs">Bot</span>
          </ToolbarButton>

          <span className="w-px bg-zinc-600 mx-1" />

          {/* Row operations */}
          <ToolbarButton
            onClick={() => editor.chain().focus().addRowBefore().run()}
            title="Add row above"
            active={false}
          >
            <span className="text-xs">+Row↑</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().addRowAfter().run()}
            title="Add row below"
            active={false}
          >
            <span className="text-xs">+Row↓</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().deleteRow().run()}
            title="Delete row"
            active={false}
          >
            <span className="text-xs">-Row</span>
          </ToolbarButton>

          <span className="w-px bg-zinc-600 mx-1" />

          {/* Column operations */}
          <ToolbarButton
            onClick={() => editor.chain().focus().addColumnBefore().run()}
            title="Add column left"
            active={false}
          >
            <span className="text-xs">+Col←</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().addColumnAfter().run()}
            title="Add column right"
            active={false}
          >
            <span className="text-xs">+Col→</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().deleteColumn().run()}
            title="Delete column"
            active={false}
          >
            <span className="text-xs">-Col</span>
          </ToolbarButton>

          <span className="w-px bg-zinc-600 mx-1" />

          {/* Cell merge / split */}
          <ToolbarButton
            onClick={() => editor.chain().focus().mergeCells().run()}
            title="Merge cells"
            active={false}
          >
            <span className="text-xs">Merge</span>
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().splitCell().run()}
            title="Split cell"
            active={false}
          >
            <span className="text-xs">Split</span>
          </ToolbarButton>

          <span className="w-px bg-zinc-600 mx-1" />

          <ToolbarButton
            onClick={() => editor.chain().focus().deleteTable().run()}
            title="Delete table"
            active={false}
            danger
          >
            <span className="text-xs">Del Table</span>
          </ToolbarButton>
        </div>
      )}

      {/* ── Row 4: image controls ─────────────────────────────────────────── */}
      {isImageSelected && (
        <div className="bg-zinc-800 border-b border-zinc-700 p-2 flex flex-wrap gap-2 items-center">
          <span className="text-xs text-zinc-400">Image:</span>

          <div className="flex items-center gap-1">
            <span className="text-xs text-zinc-500">Align</span>
            <ToolbarButton
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .updateAttributes("image", { align: "left" })
                  .run()
              }
              active={imageAttrs.align === "left"}
              title="Float Left"
            >
              <FaAlignLeft />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .updateAttributes("image", { align: "center" })
                  .run()
              }
              active={imageAttrs.align === "center"}
              title="Center"
            >
              <FaAlignCenter />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .updateAttributes("image", { align: "right" })
                  .run()
              }
              active={imageAttrs.align === "right"}
              title="Float Right"
            >
              <FaAlignRight />
            </ToolbarButton>
            <ToolbarButton
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .updateAttributes("image", { align: null })
                  .run()
              }
              active={!imageAttrs.align}
              title="No Float"
            >
              <FaRemoveFormat />
            </ToolbarButton>
          </div>

          <span className="w-px bg-zinc-600 mx-1" />

          <div className="flex items-center gap-1 flex-wrap">
            <span className="text-xs text-zinc-500">Width</span>
            {WIDTH_PRESETS.map((w) => (
              <button
                key={w}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() =>
                  editor
                    .chain()
                    .focus()
                    .updateAttributes("image", { width: w })
                    .run()
                }
                className={`px-2 py-1 rounded text-xs transition-colors ${
                  imageAttrs.width === w
                    ? "bg-zinc-600 text-white"
                    : "text-zinc-300 hover:bg-zinc-700 hover:text-white"
                }`}
              >
                {w}
              </button>
            ))}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() =>
                editor
                  .chain()
                  .focus()
                  .updateAttributes("image", { width: null })
                  .run()
              }
              className="px-2 py-1 rounded text-xs text-zinc-300 hover:bg-zinc-700 hover:text-white transition-colors"
              title="Auto width"
            >
              Auto
            </button>
            <input
              type="text"
              value={customWidth}
              onChange={(e) => setCustomWidth(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  applyCustomWidth();
                }
              }}
              onBlur={applyCustomWidth}
              placeholder="e.g. 300px"
              className="bg-zinc-700 text-zinc-200 text-xs rounded px-2 py-1 border border-zinc-600 w-24 placeholder-zinc-500"
            />
          </div>
        </div>
      )}

      <div
        className={`relative overflow-y-auto ${fullscreen ? "flex-1" : "max-h-[600px]"}`}
      >
        <DragHandle editor={editor}>
          <div className="p-1 rounded hover:bg-zinc-700 cursor-grab text-zinc-500 hover:text-zinc-300">
            <FaGripVertical size={12} />
          </div>
        </DragHandle>
        <EditorContent editor={editor} />
      </div>

      <input type="hidden" name={name} value={editor.getHTML()} />

      <FormAssetModal
        name="richTextImage"
        open={showImageModal}
        onClose={(_assetId, publicUrl) => {
          if (publicUrl)
            editor.chain().focus().setImage({ src: publicUrl }).run();
          setShowImageModal(false);
        }}
      />
    </div>
  );
};

export default RichTextEditor;
