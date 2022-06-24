export function stripBOM(content: string): string {
  if (content.charCodeAt(0) === 0xfeff) return content.slice(1);
  return content;
}
