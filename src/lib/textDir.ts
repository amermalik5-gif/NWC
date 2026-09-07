/** Returns 'rtl' if the string's first strong character is Arabic/Hebrew, otherwise 'ltr'. */
export function getTextDir(text?: string | null): 'rtl' | 'ltr' {
  if (!text) return 'ltr'
  for (const char of text) {
    const cp = char.codePointAt(0) ?? 0
    // Arabic, Arabic Supplement, Arabic Extended-A, Arabic Presentation Forms
    if ((cp >= 0x0600 && cp <= 0x06FF) || (cp >= 0x0750 && cp <= 0x077F) ||
        (cp >= 0x08A0 && cp <= 0x08FF) || (cp >= 0xFB50 && cp <= 0xFDFF) ||
        (cp >= 0xFE70 && cp <= 0xFEFF)) {
      return 'rtl'
    }
    // Hebrew
    if (cp >= 0x0590 && cp <= 0x05FF) return 'rtl'
    // Skip whitespace/punctuation to find first strong char
    if (/\p{L}/u.test(char)) return 'ltr'
  }
  return 'ltr'
}
