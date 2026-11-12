// Pure helper that builds the one-line preview shown on an item card.

import type { ContentType } from "@/generated/prisma/client";

export const PREVIEW_MAX_LENGTH = 120;
const ELLIPSIS = "…";

export interface PreviewSource {
  typeName: string;
  contentType: ContentType;
  content: string | null;
  url: string | null;
  fileName: string | null;
}

function getUrlHost(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

const FENCED_CODE_BLOCK = /```[\s\S]*?(```|$)/g;

// First prose line of markdown (headings usually repeat the title; code blocks and tables are skipped),
// without emphasis markers
function getMarkdownPreview(content: string): string {
  const lines = content
    .replace(FENCED_CODE_BLOCK, "")
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith("|"));
  const firstLine = lines.find((line) => !line.startsWith("#")) ?? lines[0] ?? "";
  // Underscores are left alone: they are LaTeX subscripts far more often than emphasis here
  return firstLine.replace(/^#+\s*/, "").replace(/^[-*]\s+/, "").replace(/[*`]/g, "");
}

function collapseWhitespace(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function truncate(text: string): string {
  return text.length > PREVIEW_MAX_LENGTH ? `${text.slice(0, PREVIEW_MAX_LENGTH - 1).trimEnd()}${ELLIPSIS}` : text;
}

function getRawPreview({ typeName, contentType, content, url, fileName }: PreviewSource): string {
  switch (contentType) {
    case "URL":
      return url ? getUrlHost(url) : "";
    case "FILE":
      return fileName ?? "";
    case "TEXT":
      if (!content) return "";
      // Notes are markdown; flashcard fronts, formulas and questions are shown as written
      return typeName === "note" ? getMarkdownPreview(content) : collapseWhitespace(content);
  }
}

export function getItemPreview(source: PreviewSource): string | null {
  const preview = truncate(getRawPreview(source));
  return preview.length > 0 ? preview : null;
}
