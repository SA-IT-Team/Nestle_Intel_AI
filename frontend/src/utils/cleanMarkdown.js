// Light safety net — the backend already force_plain_text()'s the insight.
// This just catches any stray symbols that slip through.
export function cleanMarkdown(text) {
  if (!text) return ''
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')   // **bold** → bold
    .replace(/\*(.+?)\*/g, '$1')       // *italic* → italic
    .replace(/`[^`]+`/g, '')           // strip `code`
    .replace(/#{1,6}\s+/g, '')         // strip ## headings
    .replace(/^\s*[-*+>]\s*/gm, '')    // strip bullets / blockquotes
    .replace(/^\s*\d+\.\s*/gm, '')     // strip "1. " list markers
    .replace(/\|/g, '')                // strip pipe chars
    .replace(/[^\x00-\xFF]/g, '')      // strip emojis / non-latin
    .replace(/\s+/g, ' ')             // collapse whitespace
    .trim()
}
