const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
const PHONE_RE = /(\+?\d{1,3}[\s-]?)?(\(?\d{3,4}\)?[\s-]?)\d{3}[\s-]?\d{3,4}/;

export function extractEmail(text: string): string | null {
  const match = text.match(EMAIL_RE);
  return match ? match[0] : null;
}

export function extractPhone(text: string): string | null {
  const match = text.match(PHONE_RE);
  return match ? match[0].trim() : null;
}

export function extractCandidateName(text: string): string | null {
  const lines = text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
  for (const line of lines.slice(0, 8)) {
    if (EMAIL_RE.test(line) || PHONE_RE.test(line)) continue;
    if (/^(curriculum vitae|resume|cv)\b/i.test(line)) continue;
    const words = line.split(/\s+/);
    if (words.length >= 2 && words.length <= 5 && /^[A-Za-z][A-Za-z .'-]+$/.test(line)) {
      return line;
    }
  }
  return null;
}
