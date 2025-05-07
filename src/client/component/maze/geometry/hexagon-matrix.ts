/* eslint-disable @typescript-eslint/no-unnecessary-type-conversion */
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
export const pillarMatrix: PillarMatrix = ['ab', 'bc', 'cd', 'de', 'ef', 'fa'];

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
  a: ['a', 'bf', 'ce', 'd'],
  b: ['b', 'ac', 'df', 'e'],
  c: ['c', 'bd', 'ae', 'f'],
  d: ['d', 'ce', 'bf', 'a'],
  e: ['e', 'df', 'ac', 'b'],
  f: ['f', 'ae', 'bd', 'c'],
};

export const moveMatrix: MoveMatrix = {
  0: {
    a: { x: +0, y: -1 },
    b: { x: +1, y: -1 },
    c: { x: +1, y: +0 },
    d: { x: +0, y: +1 },
    e: { x: -1, y: +0 },
    f: { x: -1, y: -1 },
  },
  1: {
    a: { x: +0, y: -1 },
    b: { x: +1, y: +0 },
    c: { x: +1, y: +1 },
    d: { x: +0, y: +1 },
    e: { x: -1, y: +1 },
    f: { x: -1, y: +0 },
  },
};

export const preferredMatrix: PreferredMatrix = {
  0: ['b', 'c', 'd'],
  1: ['b', 'c', 'd'],
};

export const pathMatrix: PathMatrix = {
  a: 90,
  b: 30,
  c: 330,
  d: 270,
  e: 210,
  f: 150,
};
