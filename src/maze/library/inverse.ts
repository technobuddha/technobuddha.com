import { modulo } from '@technobuddha/library';
import Color from 'colorjs.io';

export function inverse(color: string): string {
  const c = new Color(color);
  console.log('inv', c.oklch.l + 0, c.oklch.c + 0, c.oklch.h + 0);
  if (c.oklch.c + 0 === 0) {
    c.oklch.l = 1 - c.oklch.l;
  } else {
    c.oklch.h = modulo(c.oklch.hue + 180, 360);
  }
  return c.toString();
}
