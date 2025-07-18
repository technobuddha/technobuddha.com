import Color from 'colorjs.io';

export function alpha(color: string, amount: number): string {
  const c = new Color(color);
  c.alpha *= amount;
  return c.toString();
}
