import {
  type DirectionMatrix,
  type EdgesMatrix,
  type MoveMatrix,
  type OppositeMatrix,
  type PathMatrix,
  type PillarMatrix,
  type TurnMatrix,
  type WallMatrix,
} from './maze.ts';

export const directionMatrix: DirectionMatrix = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const pillarMatrix: PillarMatrix = [
  'ab',
  'bc',
  'cd',
  'da',
  'de',
  'fb',
  'bg',
  'gd',
  'bh',
  'hd',
];

export const wallMatrix: WallMatrix = {
  0: { a: true, b: true, c: true, d: true },
  1: { e: true, f: true, b: true, c: true, d: true },
};

export const oppositeMatrix: OppositeMatrix = {
  a: 'c',
  b: 'd',
  c: 'a',
  d: 'b',
  e: 'g',
  f: 'h',
  g: 'e',
  h: 'f',
};

export const straightMatrix: TurnMatrix = {
  a: ['a', 'fe', 'bd', 'gh', 'c'],
  b: ['b', 'fh', 'ca', 'ge', 'd'],
  c: ['c', 'gh', 'db', 'ef', 'a'],
  d: ['d', 'eg', 'ac', 'fh', 'b'],
  e: ['e', 'a', 'f', 'd', 'b', 'h', 'c', 'g'],
  f: ['f', 'a', 'e', 'b', 'd', 'g', 'c', 'h'],
  g: ['g', 'c', 'h', 'd', 'b', 'f', 'a', 'e'],
  h: ['h', 'c', 'g', 'b', 'd', 'e', 'a', 'f'],
};

export const rightTurnMatrix: TurnMatrix = {
  a: {
    0: ['b', 'a', 'd', 'c', 'g', 'h'],
    1: ['b', 'f', 'e', 'd', 'c', 'g', 'h'],
  },
  b: {
    0: ['c', 'g', 'h', 'b', 'a', 'd'],
    1: ['c', 'g', 'h', 'b', 'f', 'e', 'd'],
  },
  c: {
    0: ['d', 'c', 'g', 'h', 'b', 'a'],
    1: ['d', 'c', 'g', 'h', 'b', 'f', 'e'],
  },
  d: {
    0: ['a', 'd', 'c', 'g', 'h', 'b'],
    1: ['f', 'e', 'd', 'c', 'g', 'h', 'b'],
  },
  e: {
    0: ['b', 'a', 'd', 'c', 'g'],
    1: ['b', 'f', 'e', 'd', 'c', 'g'],
  },
  f: {
    0: ['b', 'a', 'd', 'c', 'h'],
    1: ['b', 'f', 'e', 'd', 'c', 'h'],
  },
  g: {
    1: ['d', 'c', 'g', 'h', 'b', 'f', 'e'],
  },
  h: {
    1: ['e', 'd', 'c', 'g', 'h', 'b', 'f'],
  },
};

export const leftTurnMatrix: TurnMatrix = {
  a: {
    0: ['d', 'a', 'b', 'h', 'g', 'c'],
    1: ['d', 'e', 'f', 'b', 'h', 'g', 'c'],
  },
  b: {
    0: ['a', 'b', 'h', 'c', 'g', 'd'],
    1: ['e', 'f', 'b', 'h', 'g', 'c', 'd'],
  },
  c: {
    0: ['b', 'h', 'c', 'g', 'd', 'a'],
    1: ['b', 'h', 'c', 'g', 'd', 'e', 'f'],
  },
  d: {
    0: ['h', 'g', 'c', 'd', 'a', 'b'],
    1: ['h', 'g', 'c', 'd', 'e', 'f', 'b'],
  },
  e: {
    0: ['d', 'a', 'b', 'h', 'g', 'c'],
    1: ['d', 'e', 'f', 'b', 'h', 'g', 'c'],
  },
  f: {
    0: ['d', 'a', 'b', 'h', 'g', 'c'],
    1: ['d', 'e', 'f', 'b', 'h', 'g', 'c'],
  },
  g: {
    1: ['f', 'b', 'h', 'g', 'c', 'd', 'e'],
  },
  h: {
    1: ['b', 'h', 'g', 'c', 'd', 'e', 'f'],
  },
};

export const moveMatrix: MoveMatrix = {
  0: {
    a: { x: +0, y: +1 },
    b: { x: +1, y: +0 },
    c: { x: +0, y: -1 },
    g: { x: +0, y: -1, zone: 'down' },
    h: { x: +0, y: -1, zone: 'down' },
    d: { x: -1, y: +0 },
  },
  1: {
    e: { x: +0, y: +1, zone: 'up' },
    f: { x: +1, y: +1, zone: 'up' },
    b: { x: +1, y: +0 },
    c: { x: +0, y: -1 },
    g: { x: +0, y: -1, zone: 'down' },
    h: { x: +0, y: -1, zone: 'down' },
    d: { x: -1, y: +0 },
  },
};

export const edgesMatrix: EdgesMatrix = {
  0: ['a', 'd'],
  1: ['e', 'f', 'd'],
  2: ['a', 'd'],
  3: ['a', 'd'],
};

export const pathMatrix: PathMatrix = {
  a: 0,
  b: 270,
  c: 180,
  d: 90,
  e: 45,
  f: 315,
  g: 180,
  h: 180,
};
