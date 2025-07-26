import { modulo } from '@technobuddha/library';
import Color from 'colorjs.io';

export function inverse(color: string): string {
  const c = new Color(color);
  c.oklch.h = modulo(c.oklch.hue + 180, 360);
  return c.toString();
}
