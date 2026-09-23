export const splitMultilineDraft = (value: string) => value.replace(/\r\n?/g, '\n').split('\n');

export const normalizeMultilineItems = (items: string[]) => items
  .map((item) => item.trim())
  .filter(Boolean);
