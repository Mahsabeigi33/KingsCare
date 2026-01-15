export type MarkdownBlock =
  | { type: "list"; items: string[] }
  | { type: "paragraph"; text: string };

const listItemPattern = /^\s*(?:[-*+]|\d+\.)\s+(.+)$/;

export function parseMarkdown(input: string): MarkdownBlock[] {
  const text = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const lines = text.split("\n");
  const blocks: MarkdownBlock[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];

  const flushParagraph = () => {
    if (!paragraphLines.length) return;
    blocks.push({ type: "paragraph", text: paragraphLines.join(" ") });
    paragraphLines = [];
  };

  const flushList = () => {
    if (!listItems.length) return;
    blocks.push({ type: "list", items: listItems });
    listItems = [];
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    const match = listItemPattern.exec(rawLine);
    if (match) {
      flushParagraph();
      listItems.push(match[1].trim());
      continue;
    }

    if (listItems.length) {
      listItems[listItems.length - 1] = `${listItems[listItems.length - 1]} ${line}`;
    } else {
      paragraphLines.push(line);
    }
  }

  flushParagraph();
  flushList();

  return blocks;
}
