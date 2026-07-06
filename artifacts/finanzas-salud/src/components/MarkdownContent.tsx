import React from 'react';

interface MarkdownContentProps {
  content: string;
  className?: string;
}

/**
 * Safe markdown-to-HTML renderer. Converts a small subset of Markdown
 * (headings, bold, italic, lists, paragraphs) without using dangerouslySetInnerHTML.
 * All user-visible content comes from the seeded DB, but we render safely to
 * prevent any stored-XSS if content were ever user-supplied in the future.
 */
export const MarkdownContent: React.FC<MarkdownContentProps> = ({ content, className }) => {
  const lines = content.split('\n');

  const parseLine = (line: string): React.ReactNode[] => {
    // Bold + italic combined **text**
    const parts = line.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        return <strong key={i}>{part.slice(2, -2)}</strong>;
      }
      if (part.startsWith('*') && part.endsWith('*')) {
        return <em key={i}>{part.slice(1, -1)}</em>;
      }
      return part;
    });
  };

  const elements: React.ReactNode[] = [];
  let listItems: string[] = [];

  const flushList = () => {
    if (listItems.length > 0) {
      elements.push(
        <ul key={`ul-${elements.length}`} className="list-disc list-outside ml-6 space-y-1 my-4">
          {listItems.map((item, i) => (
            <li key={i} className="leading-relaxed">{parseLine(item)}</li>
          ))}
        </ul>
      );
      listItems = [];
    }
  };

  lines.forEach((line, idx) => {
    const trimmed = line.trim();
    if (!trimmed) {
      flushList();
      return;
    }
    if (trimmed.startsWith('## ')) {
      flushList();
      elements.push(<h2 key={idx} className="text-2xl md:text-3xl font-serif font-bold mt-10 mb-4 text-foreground">{trimmed.slice(3)}</h2>);
    } else if (trimmed.startsWith('### ')) {
      flushList();
      elements.push(<h3 key={idx} className="text-xl font-serif font-bold mt-8 mb-3 text-foreground">{trimmed.slice(4)}</h3>);
    } else if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      listItems.push(trimmed.slice(2));
    } else {
      flushList();
      elements.push(<p key={idx} className="leading-relaxed my-4 text-foreground/85">{parseLine(trimmed)}</p>);
    }
  });

  flushList();

  return <div className={className} data-testid="text-article-content">{elements}</div>;
};
