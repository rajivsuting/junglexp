import React from "react";

type TextNode = {
  text: string;
  format: number;
  type: "text";
};

type LinkNode = {
  type: "link";
  url: string;
  children: LexicalNode[];
};

type ElementNode = {
  type: string;
  tag?: string;
  format?: string;
  indent?: number;
  children: LexicalNode[];
  [key: string]: any;
};

type LexicalNode = TextNode | ElementNode | LinkNode;

const IS_BOLD = 1;
const IS_ITALIC = 2;
const IS_STRIKETHROUGH = 4;
const IS_UNDERLINE = 8;
const IS_CODE = 16;
const IS_SUBSCRIPT = 32;
const IS_SUPERSCRIPT = 64;

function renderText(node: TextNode): React.ReactNode {
  let text: React.ReactNode = node.text;

  if (node.format & IS_BOLD) {
    text = <strong key="bold">{text}</strong>;
  }
  if (node.format & IS_ITALIC) {
    text = <em key="italic">{text}</em>;
  }
  if (node.format & IS_STRIKETHROUGH) {
    text = (
      <span key="strikethrough" className="line-through">
        {text}
      </span>
    );
  }
  if (node.format & IS_UNDERLINE) {
    text = (
      <span key="underline" className="underline">
        {text}
      </span>
    );
  }
  if (node.format & IS_CODE) {
    text = (
      <code key="code" className="bg-gray-100 rounded px-1">
        {text}
      </code>
    );
  }

  return text;
}

function renderNode(node: LexicalNode, index: number): React.ReactNode {
  if (node.type === "text") {
    return (
      <React.Fragment key={index}>
        {renderText(node as TextNode)}
      </React.Fragment>
    );
  }

  const element = node as ElementNode;
  const children = element.children?.map((child, i) => renderNode(child, i));

  switch (element.type) {
    case "root":
      return <div key={index}>{children}</div>;
    case "paragraph":
      // Empty paragraph handling
      if (children?.length === 0) {
        return <br key={index} />;
      }
      return (
        <p key={index} className="leading-relaxed">
          {children}
        </p>
      );
    case "heading":
      const Tag = (element.tag || "h1") as keyof React.JSX.IntrinsicElements;
      const classes = {
        h1: "scroll-m-20 text-3xl font-extrabold tracking-tight lg:text-4xl",
        h2: "scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0 mb-4",
        h3: "scroll-m-20 text-xl font-semibold tracking-tight mb-1",
        h4: "scroll-m-20 text-lg font-semibold tracking-tight mb-1",
        h5: "scroll-m-20 text-base font-semibold tracking-tight mb-1",
        h6: "scroll-m-20 text-sm font-semibold tracking-tight",
      };
      return (
        <Tag
          key={index}
          className={classes[element.tag as keyof typeof classes] || ""}
        >
          {children}
        </Tag>
      );
    case "list":
      if (element.tag === "ol") {
        return (
          <ol
            key={index}
            className="list-decimal list-outside ml-5 mb-2 space-y-1"
          >
            {children}
          </ol>
        );
      }
      return (
        <ul key={index} className="list-disc list-outside ml-5 mb-2 space-y-1">
          {children}
        </ul>
      );
    case "listitem":
      return (
        <li key={index} className="pl-1">
          {children}
        </li>
      );
    case "quote":
      return (
        <blockquote
          key={index}
          className="border-l-4 border-gray-300 pl-4 italic my-2"
        >
          {children}
        </blockquote>
      );
    case "link":
      const linkNode = node as LinkNode;
      return (
        <a
          key={index}
          href={linkNode.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 hover:underline"
        >
          {children}
        </a>
      );
    case "image":
      // Assuming image node structure from our admin implementation
      // It usually doesn't have children but has src/alt props directly
      const { src, altText, width, height, maxWidth } = element;

      return (
        <span key={index} className="block my-4">
          <img
            src={src}
            alt={altText}
            style={{
              maxWidth: "100%",
              width: width === "inherit" || width === 0 ? "100%" : width,
              height: height === "inherit" || height === 0 ? "auto" : height,
            }}
            className="rounded-lg"
          />
        </span>
      );
    case "horizontalrule":
      return <hr key={index} className="my-8 border-t border-gray-200" />;
    default:
      return <div key={index}>{children}</div>;
  }
}

export function LexicalRenderer({ content }: { content: string }) {
  if (!content) return null;

  try {
    const parsed = JSON.parse(content);
    // Check if it's a valid Lexical state structure (has root)
    if (parsed.root) {
      return (
        <div className="lexical-content text-primary">
          {renderNode(parsed.root, 0)}
        </div>
      );
    }
    // Fallback if it's not JSON or root (maybe plain text or HTML string from legacy)
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  } catch (e) {
    // Not JSON, assume HTML or text
    return <div dangerouslySetInnerHTML={{ __html: content }} />;
  }
}
