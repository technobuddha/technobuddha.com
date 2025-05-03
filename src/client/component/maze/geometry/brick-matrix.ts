import {
  type DirectionMatrix,
  type MoveMatrix,
  type OppositeMatrix,
  type PathMatrix,
  type PillarMatrix,
  type PreferredMatrix,
  type TurnMatrix,
  type WallMatrix,
} from './maze.ts';

export const directionMatrix: DirectionMatrix = ['a', 'b', 'c', 'd', 'e', 'f'];
export const pillarMatrix: PillarMatrix = ['fa', 'ab', 'bc', 'cd', 'de', 'ef'];

export const wallMatrix: WallMatrix = {
  0: { a: true, b: true, c: true, d: true, e: true, f: true },
  1: { a: true, b: true, c: true, d: true, e: true, f: true },
};

export const oppositeMatrix: OppositeMatrix = {
  a: 'd',
  b: 'e',
  c: 'f',
  d: 'a',
  e: 'b',
  f: 'c',
};

export const rightTurnMatrix: TurnMatrix = {
  a: ['c', 'b', 'a', 'f', 'e', 'd'],
  b: ['d', 'c', 'b', 'a', 'f', 'e'],
  c: ['e', 'd', 'c', 'b', 'a', 'f'],
  d: ['f', 'e', 'd', 'c', 'b', 'a'],
  e: ['a', 'f', 'e', 'd', 'c', 'b'],
  f: ['b', 'a', 'f', 'e', 'd', 'c'],
};

export const leftTurnMatrix: TurnMatrix = {
  a: ['e', 'f', 'a', 'b', 'c', 'd'],
  b: ['f', 'a', 'b', 'c', 'd', 'e'],
  c: ['a', 'b', 'c', 'd', 'e', 'f'],
  d: ['b', 'c', 'd', 'e', 'f', 'a'],
  e: ['c', 'd', 'e', 'f', 'a', 'b'],
  f: ['d', 'e', 'f', 'a', 'b', 'c'],
};

export const straightMatrix: TurnMatrix = {
  a: ['a', 'b', 'f', 'c', 'd', 'e'],
  b: ['b', 'a', 'c', 'f', 'e', 'd'],
  c: ['c', 'b', 'd', 'e', 'a', 'f'],
  d: ['d', 'e', 'c', 'f', 'a', 'b'],
  e: ['e', 'd', 'f', 'c', 'd', 'a'],
  f: ['f', 'a', 'e', 'd', 'b', 'c'],
};

export const moveMatrix: MoveMatrix = {
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

export const preferredMatrix: PreferredMatrix = {
  0: ['e', 'd', 'c'],
  1: ['e', 'd', 'c'],
};

export const pathMatrix: PathMatrix = {
  a: 135,
  b: 45,
  c: 0,
  d: 315,
  e: 225,
  f: 180,
};
