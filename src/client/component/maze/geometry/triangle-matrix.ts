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

export const pillarMatrix: PillarMatrix = ['ac', 'ce', 'ea', 'bd', 'df', 'fb'];

export const wallMatrix: WallMatrix = {
  0: { b: true, d: true, f: true },
  1: { a: true, c: true, e: true },
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
  a: ['b', 'f', 'd'],
  b: ['c', 'a', 'e'],
  c: ['d', 'b', 'f'],
  d: ['e', 'c', 'a'],
  e: ['f', 'd', 'b'],
  f: ['a', 'e', 'c'],
};

export const leftTurnMatrix: TurnMatrix = {
  a: ['f', 'b', 'd'],
  b: ['a', 'c', 'e'],
  c: ['b', 'd', 'f'],
  d: ['c', 'e', 'a'],
  e: ['d', 'f', 'b'],
  f: ['e', 'a', 'c'],
};

export const straightMatrix: TurnMatrix = {
  a: ['bf', 'd'],
  b: ['ac', 'e'],
  c: ['bd', 'f'],
  d: ['ce', 'a'],
  e: ['df', 'b'],
  f: ['ea', 'c'],
};

export const moveMatrix: MoveMatrix = {
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

export const preferredMatrix: PreferredMatrix = {
  0: ['b', 'd'],
  1: ['c'],
};

export const pathMatrix: PathMatrix = {
  a: 270,
  b: 30,
  c: 150,
  d: 270,
  e: 30,
  f: 150,
};
