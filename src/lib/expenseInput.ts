export function sanitizeAmountInput(raw: string) {
  let result = '';
  let hasDecimalPoint = false;

  for (const character of raw) {
    if (character >= '0' && character <= '9') {
      result += character;
      continue;
    }
    if (character === '.' && !hasDecimalPoint) {
      result += character;
      hasDecimalPoint = true;
    }
  }

  if (result.startsWith('.')) return `0${result}`;
  return result;
}
