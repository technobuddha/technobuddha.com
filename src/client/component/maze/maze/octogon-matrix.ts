import { type Direction, type Kind, type Pillar, type XY } from './maze.js';

export const directionMatrix: Direction[] = [
  'a',
  'b',
  'c',
  'd',
  'e',
  'f',
  'g',
  'h',
  'i',
  'j',
  'k',
  'l',
];
export const pillarMatrix: Pillar[] = [
  'ab',
  'bc',
  'cd',
  'de',
  'ef',
  'fg',
  'gh',
  'ha',
  'ij',
  'jk',
  'kl',
  'li',
];

export const sidesMatrix: Record<Kind, number> = {
  0: 8,
  1: 4,
};

export const wallMatrix: Record<Kind, Record<Direction, boolean>> = {
  0: { a: true, b: true, c: true, d: true, e: true, f: true, g: true, h: true },
  1: { i: true, j: true, k: true, l: true },
};

export const oppositeMatrix: Record<Direction, Direction> = {
  a: 'e',
  b: 'k',
  c: 'g',
  d: 'l',
  e: 'a',
  f: 'i',
  g: 'c',
  h: 'j',
  i: 'f',
  j: 'h',
  k: 'b',
  l: 'd',
};

export const rightTurnMatrix: Record<Direction, Direction[]> = {
  a: ['d', 'c', 'b', 'a', 'h', 'g', 'f', 'e'],
  b: ['j', 'i', 'l', 'k'],
  c: ['f', 'e', 'd', 'c', 'b', 'a', 'h', 'g'],
  d: ['k', 'j', 'i', 'l'],
  e: ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'],
  f: ['l', 'k', 'j', 'i'],
  g: ['b', 'a', 'h', 'g', 'f', 'e', 'd', 'c'],
  h: ['i', 'l', 'k', 'j'],
  i: ['e', 'd', 'c', 'b', 'a', 'h', 'g', 'f'],
  j: ['g', 'f', 'e', 'd', 'c', 'b', 'a', 'h'],
  k: ['a', 'h', 'g', 'f', 'e', 'd', 'c', 'b'],
  l: ['c', 'b', 'a', 'h', 'g', 'f', 'e', 'd'],
};

export const leftTurnMatrix: Record<Direction, Direction[]> = {
  a: ['f', 'g', 'h', 'a', 'b', 'c', 'd', 'e'],
  b: ['l', 'i', 'j', 'k'],
  c: ['h', 'a', 'b', 'c', 'd', 'e', 'f', 'g'],
  d: ['i', 'j', 'k', 'l'],
  e: ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'a'],
  f: ['j', 'k', 'l', 'i'],
  g: ['d', 'e', 'f', 'g', 'h', 'a', 'b', 'c'],
  h: ['k', 'l', 'i', 'j'],
  i: ['g', 'h', 'a', 'b', 'c', 'd', 'e', 'f'],
  j: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  k: ['c', 'd', 'e', 'f', 'g', 'h', 'a', 'b'],
  l: ['e', 'f', 'g', 'h', 'a', 'b', 'c', 'd'],
};

export const moveMatrix: Record<Kind, Record<Direction, XY>> = {
  0: {
    a: { x: +0, y: -1 },
    b: { x: +1, y: -1 },
    c: { x: +2, y: +0 },
    d: { x: +1, y: +0 },
    e: { x: +0, y: +1 },
    f: { x: -1, y: +0 },
    g: { x: -2, y: +0 },
    h: { x: -1, y: -1 },
  },
  1: {
    i: { x: +1, y: +0 },
    j: { x: +1, y: +1 },
    k: { x: -1, y: +1 },
    l: { x: -1, y: +0 },
  },
};

export const edgesMatrix: Record<Kind, Direction[]> = {
  0: ['c', 'd', 'e'],
  1: ['j'],
};
