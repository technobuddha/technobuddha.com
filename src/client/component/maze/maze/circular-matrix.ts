import {
  type DirectionMatrix,
  type EdgesMatrix,
  type MoveMatrix,
  type OppositeMatrix,
  type PathMatrix,
  type PillarMatrix,
  type SidesMatrix,
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

export const sidesMatrix: SidesMatrix = {
  0: 4,
  1: 5,
  2: 4,
  3: 4,
};

export const wallMatrix: WallMatrix = {
  0: { a: true, b: true, c: true, d: true },
  1: { e: true, f: true, b: true, c: true, d: true },
  2: { a: true, b: true, g: true, d: true },
  3: { a: true, b: true, h: true, d: true },
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

export const rightTurnMatrix: TurnMatrix = {
  a: {
    0: ['b', 'a', 'd', 'c'],
    1: ['b', 'f', 'e', 'd', 'c'],
  },
  b: {
    0: ['c', 'b', 'a', 'd'],
    1: ['c', 'b', 'f', 'e', 'd'],
    2: ['g', 'b', 'a', 'd'],
    3: ['h', 'b', 'a', 'd'],
  },
  c: {
    0: ['d', 'c', 'b', 'a'],
    2: ['d', 'g', 'b', 'a'],
    3: ['d', 'h', 'b', 'a'],
  },
  d: {
    0: ['a', 'd', 'c', 'b'],
    1: ['f', 'e', 'd', 'c', 'b'],
    2: ['a', 'd', 'g', 'b'],
    3: ['a', 'd', 'h', 'b'],
  },
  e: {
    2: ['b', 'a', 'd', 'g'],
  },
  f: {
    3: ['b', 'a', 'd', 'h'],
  },
  g: {
    1: ['d', 'c', 'b', 'f', 'e'],
  },
  h: {
    1: ['e', 'd', 'c', 'b', 'f'],
  },
};

export const leftTurnMatrix: TurnMatrix = {
  a: {
    0: ['d', 'a', 'b', 'c'],
    1: ['d', 'e', 'f', 'b', 'c'],
  },
  b: {
    0: ['a', 'b', 'c', 'd'],
    1: ['e', 'f', 'b', 'c', 'd'],
    2: ['a', 'b', 'g', 'd'],
    3: ['a', 'b', 'h', 'd'],
  },
  c: {
    0: ['b', 'c', 'd', 'a'],
    2: ['b', 'g', 'd', 'a'],
    3: ['b', 'h', 'd', 'a'],
  },
  d: {
    0: ['c', 'd', 'a', 'b'],
    1: ['c', 'd', 'e', 'f', 'b'],
    2: ['g', 'd', 'a', 'b'],
    3: ['h', 'd', 'a', 'b'],
  },
  e: {
    2: ['d', 'a', 'b', 'g'],
  },
  f: {
    3: ['d', 'a', 'b', 'h'],
  },
  g: {
    1: ['f', 'b', 'c', 'd', 'e'],
  },
  h: {
    1: ['b', 'c', 'd', 'e', 'f'],
  },
};

export const moveMatrix: MoveMatrix = {
  0: {
    a: { x: +0, y: +1 },
    b: { x: +1, y: +0 },
    c: { x: +0, y: -1 },
    d: { x: -1, y: +0 },
  },
  1: {
    e: { x: +0, y: +1, zone: 'up' },
    f: { x: +1, y: +1, zone: 'up' },
    b: { x: +1, y: +0 },
    c: { x: +0, y: -1 },
    d: { x: -1, y: +0 },
  },
  2: {
    a: { x: +0, y: +1 },
    b: { x: +1, y: +0 },
    d: { x: -1, y: +0 },
    g: { x: +0, y: -1, zone: 'down' },
  },
  3: {
    a: { x: +0, y: +1 },
    b: { x: +1, y: +0 },
    d: { x: -1, y: +0 },
    h: { x: +0, y: -1, zone: 'down' },
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
  g: 270,
  h: 90,
  i: 180,
  j: 180,
};
