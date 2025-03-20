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
  'ca',
  'de',
  'ef',
  'fd',
  'gh',
  'hi',
  'ig',
  'jk',
  'kl',
  'lj',
];

export const sidesMatrix: Record<Kind, number> = {
  0: 3,
  1: 3,
  2: 3,
  3: 3,
};

export const wallMatrix: Record<Kind, Record<Direction, boolean>> = {
  0: { a: true, b: true, c: true },
  1: { d: true, e: true, f: true },
  2: { g: true, h: true, i: true },
  3: { j: true, k: true, l: true },
};

export const oppositeMatrix: Record<Direction, Direction> = {
  a: 'h',
  b: 'd',
  c: 'k',
  d: 'b',
  e: 'i',
  f: 'j',
  g: 'l',
  h: 'a',
  i: 'e',
  j: 'f',
  k: 'c',
  l: 'g',
};

export const rightTurnMatrix: Record<Direction, Direction[]> = {
  a: ['g', 'i', 'h'],
  b: ['f', 'e', 'd'],
  c: ['j', 'l', 'k'],
  d: ['a', 'c', 'b'],
  e: ['h', 'g', 'i'],
  f: ['l', 'k', 'j'],
  g: ['k', 'j', 'l'],
  h: ['c', 'b', 'a'],
  i: ['d', 'f', 'e'],
  j: ['e', 'd', 'f'],
  k: ['b', 'a', 'c'],
  l: ['i', 'h', 'g'],
};

export const leftTurnMatrix: Record<Direction, Direction[]> = {
  a: ['i', 'g', 'h'],
  b: ['e', 'f', 'd'],
  c: ['l', 'j', 'k'],
  d: ['c', 'a', 'b'],
  e: ['g', 'h', 'i'],
  f: ['k', 'l', 'j'],
  g: ['j', 'k', 'l'],
  h: ['b', 'c', 'a'],
  i: ['f', 'd', 'e'],
  j: ['d', 'e', 'f'],
  k: ['a', 'b', 'c'],
  l: ['h', 'i', 'g'],
};

export const moveMatrix: Record<Kind, Record<Direction, XY>> = {
  0: {
    a: { x: +0, y: -1 },
    b: { x: +1, y: +0 },
    c: { x: -1, y: +0 },
  },
  1: {
    d: { x: -1, y: +0 },
    e: { x: +1, y: +0 },
    f: { x: +0, y: +1 },
  },
  2: {
    g: { x: +1, y: +0 },
    h: { x: +0, y: +1 },
    i: { x: -1, y: +0 },
  },
  3: {
    j: { x: +0, y: -1 },
    k: { x: +1, y: +0 },
    l: { x: -1, y: +0 },
  },
};

export const edgesMatrix: Record<Kind, Direction[]> = {
  0: ['b'],
  1: ['e', 'f'],
  2: ['g', 'h'],
  3: ['k'],
};

export const pathMatrix: Record<Direction, number> = {
  a: 90,
  b: 315,
  c: 180,
  d: 135,
  e: 0,
  f: 270,
  g: 45,
  h: 270,
  i: 180,
  j: 90,
  k: 0,
  l: 225,
};
