export const UNDEFINED = '(undefined)';

export function restoreUndefined(text: string): string | undefined {
  return text === UNDEFINED ? undefined : text;
}

export function fixUndefined(text: string | undefined): string {
  return text ?? UNDEFINED;
}
