import Color from 'colorjs.io';

export function darken(color: string, amount: number): string {
  return new Color(new Color(color).darken(amount)).toString();
}
