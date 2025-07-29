import Color from 'colorjs.io';

export function mix(color1: string, color2: string): string {
  return Color.mix(color1, color2).toString();
}
