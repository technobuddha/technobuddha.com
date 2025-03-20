import { type Direction, type Kind, type Pillar, type XY } from './maze.js';

export const directionMatrix: Direction[] = ['a', 'b', 'c', 'd', 'e', 'f'];

export const pillarMatrix: Pillar[] = ['ac', 'ce', 'ea', 'bd', 'df', 'fb'];

export const sidesMatrix: Record<Kind, number> = {
  0: 3,
  1: 3,
};

export const wallMatrix: Record<Kind, Record<Direction, boolean>> = {
  0: { b: true, d: true, f: true },
  1: { a: true, c: true, e: true },
};

export const oppositeMatrix: Record<Direction, Direction> = {
  a: 'd',
  b: 'e',
  c: 'f',
  d: 'a',
  e: 'b',
  f: 'c',
};

export const rightTurnMatrix: Record<Direction, Direction[]> = {
  a: ['b', 'f', 'd'],
  b: ['c', 'a', 'e'],
  c: ['d', 'b', 'f'],
  d: ['e', 'c', 'a'],
  e: ['f', 'd', 'b'],
  f: ['a', 'e', 'c'],
};

export const leftTurnMatrix: Record<Direction, Direction[]> = {
  a: ['f', 'b', 'd'],
  b: ['a', 'c', 'e'],
  c: ['b', 'd', 'f'],
  d: ['c', 'e', 'a'],
  e: ['d', 'f', 'b'],
  f: ['e', 'a', 'c'],
};

export const moveMatrix: Record<Kind, Record<Direction, XY>> = {
  0: {
    b: { x: +1, y: +0 },
    d: { x: +0, y: +1 },
    f: { x: -1, y: +0 },
  },
  1: {
    a: { x: +0, y: -1 },
    c: { x: +1, y: +0 },
    e: { x: -1, y: +0 },
  },
};

export const edgesMatrix: Record<Kind, Direction[]> = {
  0: ['b', 'd'],
  1: ['c'],
};

export const pathMatrix: Record<Direction, number> = {
  a: 270,
  b: 30,
  c: 150,
  d: 270,
  e: 30,
  f: 150,
};
