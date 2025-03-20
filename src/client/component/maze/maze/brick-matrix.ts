import { type Direction, type Kind, type Pillar, type XY } from './maze.js';

export const directionMatrix: Direction[] = ['a', 'b', 'c', 'd', 'e', 'f'];
export const pillarMatrix: Pillar[] = ['fa', 'ab', 'bc', 'cd', 'de', 'ef'];

export const wallMatrix: Record<Kind, Record<Direction, boolean>> = {
  0: { a: true, b: true, c: true, d: true, e: true, f: true },
  1: { a: true, b: true, c: true, d: true, e: true, f: true },
};

export const oppositeMatrix: Record<Direction, Direction> = {
  a: 'd',
  b: 'e',
  c: 'f',
  d: 'a',
  e: 'b',
  f: 'c',
};

export const sidesMatrix: Record<Kind, number> = {
  0: 6,
  1: 6,
};

export const rightTurnMatrix: Record<Direction, Direction[]> = {
  a: ['c', 'b', 'a', 'f', 'e', 'd'],
  b: ['d', 'c', 'b', 'a', 'f', 'e'],
  c: ['e', 'd', 'c', 'b', 'a', 'f'],
  d: ['f', 'e', 'd', 'c', 'b', 'a'],
  e: ['a', 'f', 'e', 'd', 'c', 'b'],
  f: ['b', 'a', 'f', 'e', 'd', 'c'],
};

export const leftTurnMatrix: Record<Direction, Direction[]> = {
  a: ['e', 'f', 'a', 'b', 'c', 'd'],
  b: ['f', 'a', 'b', 'c', 'd', 'e'],
  c: ['a', 'b', 'c', 'd', 'e', 'f'],
  d: ['b', 'c', 'd', 'e', 'f', 'a'],
  e: ['c', 'd', 'e', 'f', 'a', 'b'],
  f: ['d', 'e', 'f', 'a', 'b', 'c'],
};

export const moveMatrix: Record<Kind, Record<Direction, XY>> = {
  0: {
    a: { x: -1, y: -1 },
    b: { x: +0, y: -1 },
    c: { x: +1, y: +0 },
    d: { x: +0, y: +1 },
    e: { x: -1, y: +1 },
    f: { x: -1, y: +0 },
  },
  1: {
    a: { x: +0, y: -1 },
    b: { x: +1, y: -1 },
    c: { x: +1, y: +0 },
    d: { x: +1, y: +1 },
    e: { x: +0, y: +1 },
    f: { x: -1, y: +0 },
  },
};

export const edgesMatrix: Record<Kind, Direction[]> = {
  0: ['e', 'd', 'c'],
  1: ['e', 'd', 'c'],
};
