import { useMemo } from "react";
import katex from "katex";

const RENDER_OPTS = {
  throwOnError: false,
  errorColor: "#FF007A",
  strict: "ignore",
  trust: false,
  output: "html",
};

const TOKEN = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$|\\\([\s\S]+?\\\)|\\\[[\s\S]+?\\\])/g;

const strip = (raw) => {
  if (raw.startsWith("$$") && raw.endsWith("$$")) return [raw.slice(2, -2), true];
  if (raw.startsWith("\\[") && raw.endsWith("\\]")) return [raw.slice(2, -2), true];
  if (raw.startsWith("\\(") && raw.endsWith("\\)")) return [raw.slice(2, -2), false];
  return [raw.slice(1, -1), false];
};

const isDisplay = (raw) =>
  (raw.startsWith("$$") && raw.endsWith("$$")) || (raw.startsWith("\\[") && raw.endsWith("\\]"));

// Render inline KaTeX or fallback
function renderKaTeXSpan(part, key) {
  const [tex, display] = strip(part);
  let html;
  try {
    html = katex.renderToString(tex, { ...RENDER_OPTS, displayMode: display });
  } catch {
    return (
      <span key={key} className="mono text-sigma-magenta">
        {tex}
      </span>
    );
  }
  return (
    <span
      key={key}
      className={display ? "my-2 block overflow-x-auto text-center" : "inline-block"}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

// Inline parser for text with KaTeX and basic inline markdown (**bold**, *italic*, ~~strike~~, `code`)
function renderInlineContent(text) {
  if (!text) return null;
  const parts = text.split(TOKEN).filter((p) => p !== "" && p !== undefined);

  return parts.map((part, i) => {
    TOKEN.lastIndex = 0;
    if (TOKEN.test(part)) {
      TOKEN.lastIndex = 0;
      return renderKaTeXSpan(part, `k-${i}`);
    }
    TOKEN.lastIndex = 0;

    // Parse inline markdown tokens: bold, italic, code, strikethrough
    // Match `code`, **bold**, *italic*, ~~strike~~
    const inlineRegex = /(`[^`]+`|\*\*[^*]+\*\*|\*[^*]+\*|~~[^~]+~~)/g;
    const subParts = part.split(inlineRegex).filter((sp) => sp !== "" && sp !== undefined);

    return (
      <span key={`p-${i}`}>
        {subParts.map((sp, j) => {
          if (sp.startsWith("`") && sp.endsWith("`") && sp.length > 2) {
            return (
              <code key={j} className="mono mx-0.5 rounded bg-white/10 px-1.5 py-0.5 text-[0.82em] text-sigma-cyan">
                {sp.slice(1, -1)}
              </code>
            );
          }
          if (sp.startsWith("**") && sp.endsWith("**") && sp.length > 4) {
            return (
              <strong key={j} className="font-bold text-white">
                {renderInlineContent(sp.slice(2, -2))}
              </strong>
            );
          }
          if (sp.startsWith("*") && sp.endsWith("*") && sp.length > 2) {
            return (
              <em key={j} className="italic text-slate-200">
                {renderInlineContent(sp.slice(1, -1))}
              </em>
            );
          }
          if (sp.startsWith("~~") && sp.endsWith("~~") && sp.length > 4) {
            return (
              <del key={j} className="line-through text-slate-400">
                {renderInlineContent(sp.slice(2, -2))}
              </del>
            );
          }
          return <span key={j}>{sp}</span>;
        })}
      </span>
    );
  });
}

/**
 * Renders text that may contain LaTeX between $...$ (inline) or $$...$$ (display),
 * with support for markdown formatting (headings, lists, blockquotes, code blocks, bold, etc.)
 */
export const MathText = ({ children, text: textProp, className = "", as: Tag = "div", rich = true }) => {
  const content = children != null ? children : textProp != null ? textProp : "";

  // If used as an inline span or rich is disabled, keep lightweight inline rendering
  if (Tag === "span" || !rich) {
    const raw = String(content).split(TOKEN).filter((p) => p !== "" && p !== undefined);
    return (
      <Tag className={`sigma-math ${className}`}>
        {raw.map((part, i) => {
          TOKEN.lastIndex = 0;
          if (TOKEN.test(part)) {
            TOKEN.lastIndex = 0;
            return renderKaTeXSpan(part, i);
          }
          TOKEN.lastIndex = 0;
          return <span key={i}>{part}</span>;
        })}
      </Tag>
    );
  }

  // Multi-line block parser
  const blocks = useMemo(() => {
    const rawText = String(content);
    const lines = rawText.split("\n");
    const parsedBlocks = [];
    let inCodeBlock = false;
    let codeBuffer = [];
    let listBuffer = null; // { type: 'ul' | 'ol', items: [] }

    const flushList = () => {
      if (listBuffer) {
        parsedBlocks.push({ ...listBuffer });
        listBuffer = null;
      }
    };

    for (let idx = 0; idx < lines.length; idx++) {
      const line = lines[idx];

      // Code block toggle
      if (line.trim().startsWith("```")) {
        flushList();
        if (inCodeBlock) {
          parsedBlocks.push({ type: "codeblock", content: codeBuffer.join("\n") });
          codeBuffer = [];
          inCodeBlock = false;
        } else {
          inCodeBlock = true;
          codeBuffer = [];
        }
        continue;
      }

      if (inCodeBlock) {
        codeBuffer.push(line);
        continue;
      }

      // Display math $$ ... $$ on single line or started
      if (line.trim().startsWith("$$") && line.trim().endsWith("$$") && line.trim().length > 2) {
        flushList();
        parsedBlocks.push({ type: "display-math", content: line.trim() });
        continue;
      }

      // Headings
      if (line.startsWith("### ")) {
        flushList();
        parsedBlocks.push({ type: "h3", content: line.slice(4) });
        continue;
      }
      if (line.startsWith("## ")) {
        flushList();
        parsedBlocks.push({ type: "h2", content: line.slice(3) });
        continue;
      }
      if (line.startsWith("# ")) {
        flushList();
        parsedBlocks.push({ type: "h1", content: line.slice(2) });
        continue;
      }

      // Horizontal rule
      if (line.trim() === "---" || line.trim() === "***") {
        flushList();
        parsedBlocks.push({ type: "hr" });
        continue;
      }

      // Blockquotes
      if (line.startsWith("> ") || line.trim() === ">") {
        flushList();
        parsedBlocks.push({ type: "blockquote", content: line.replace(/^>\s?/, "") });
        continue;
      }

      // Unordered list
      const ulMatch = line.match(/^(\s*)[-*+]\s+(.*)$/);
      if (ulMatch) {
        if (!listBuffer || listBuffer.type !== "ul") {
          flushList();
          listBuffer = { type: "ul", items: [] };
        }
        listBuffer.items.push(ulMatch[2]);
        continue;
      }

      // Ordered list
      const olMatch = line.match(/^(\s*)\d+\.\s+(.*)$/);
      if (olMatch) {
        if (!listBuffer || listBuffer.type !== "ol") {
          flushList();
          listBuffer = { type: "ol", items: [] };
        }
        listBuffer.items.push(olMatch[2]);
        continue;
      }

      // Blank line
      if (!line.trim()) {
        flushList();
        continue;
      }

      // Regular paragraph line
      flushList();
      parsedBlocks.push({ type: "p", content: line });
    }

    flushList();
    if (inCodeBlock && codeBuffer.length > 0) {
      parsedBlocks.push({ type: "codeblock", content: codeBuffer.join("\n") });
    }

    return parsedBlocks;
  }, [content]);

  return (
    <Tag className={`sigma-math space-y-2.5 text-sm leading-relaxed ${className}`}>
      {blocks.map((b, idx) => {
        if (b.type === "h1") {
          return (
            <h2 key={idx} className="font-display text-xl font-black text-white pt-2">
              {renderInlineContent(b.content)}
            </h2>
          );
        }
        if (b.type === "h2") {
          return (
            <h3 key={idx} className="font-display text-lg font-extrabold text-white pt-1.5">
              {renderInlineContent(b.content)}
            </h3>
          );
        }
        if (b.type === "h3") {
          return (
            <h4 key={idx} className="font-display text-base font-bold text-white/95 pt-1">
              {renderInlineContent(b.content)}
            </h4>
          );
        }
        if (b.type === "blockquote") {
          return (
            <blockquote
              key={idx}
              className="border-l-4 border-sigma-cyan/70 bg-white/[0.04] px-4 py-2.5 rounded-r-2xl my-2 text-slate-200"
            >
              {renderInlineContent(b.content)}
            </blockquote>
          );
        }
        if (b.type === "ul") {
          return (
            <ul key={idx} className="my-2 space-y-1.5 pl-2">
              {b.items.map((item, itmIdx) => (
                <li key={itmIdx} className="flex items-start gap-2.5 text-slate-200">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sigma-cyan" />
                  <span className="flex-1">{renderInlineContent(item)}</span>
                </li>
              ))}
            </ul>
          );
        }
        if (b.type === "ol") {
          return (
            <ol key={idx} className="my-2 space-y-2 pl-1">
              {b.items.map((item, itmIdx) => (
                <li key={itmIdx} className="flex items-start gap-2.5 text-slate-200">
                  <span className="mono mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-[0.65rem] font-bold text-sigma-cyan border border-sigma-cyan/30">
                    {itmIdx + 1}
                  </span>
                  <span className="flex-1 pt-0.5">{renderInlineContent(item)}</span>
                </li>
              ))}
            </ol>
          );
        }
        if (b.type === "codeblock") {
          return (
            <pre
              key={idx}
              className="mono my-2 overflow-x-auto rounded-2xl border border-white/10 bg-black/60 p-3.5 text-xs text-cyan-300"
            >
              <code>{b.content}</code>
            </pre>
          );
        }
        if (b.type === "display-math") {
          return <div key={idx}>{renderKaTeXSpan(b.content, idx)}</div>;
        }
        if (b.type === "hr") {
          return <hr key={idx} className="my-3 border-white/10" />;
        }
        return (
          <p key={idx} className="text-slate-200 leading-relaxed">
            {renderInlineContent(b.content)}
          </p>
        );
      })}
    </Tag>
  );
};
