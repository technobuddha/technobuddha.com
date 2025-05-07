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

export const directionMatrix: DirectionMatrix = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];

export const pillarMatrix: PillarMatrix = ['ab', 'bc', 'cd', 'de', 'ef', 'fg', 'gh', 'ha'];

export const wallMatrix: WallMatrix = {
  0: { a: true, b: true, c: true, d: true, e: true, f: true, g: true, h: true },
};

export const oppositeMatrix: OppositeMatrix = {
  a: 'e',
  b: 'f',
  c: 'g',
  d: 'h',
  e: 'a',
  f: 'b',
  g: 'c',
  h: 'd',
};

export const rightTurnMatrix: TurnMatrix = {
  a: ['d', 'c', 'b', 'a', 'h', 'g', 'f', 'e'],
  b: ['e', 'd', 'c', 'b', 'a', 'h', 'g', 'f'],
  c: ['f', 'e', 'd', 'c', 'b', 'a', 'h', 'g'],
  d: ['g', 'f', 'e', 'd', 'c', 'b', 'a', 'h'],
  e: ['h', 'g', 'f', 'e', 'd', 'c', 'b', 'a'],
  f: ['a', 'h', 'g', 'f', 'e', 'd', 'c', 'b'],
  g: ['b', 'a', 'h', 'g', 'f', 'e', 'd', 'c'],
  h: ['c', 'b', 'a', 'h', 'g', 'f', 'e', 'd'],
};

export const leftTurnMatrix: TurnMatrix = {
  a: ['f', 'g', 'h', 'a', 'b', 'c', 'd', 'e'],
  b: ['g', 'h', 'a', 'b', 'c', 'd', 'e', 'f'],
  c: ['h', 'a', 'b', 'c', 'd', 'e', 'f', 'g'],
  d: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  e: ['b', 'c', 'd', 'e', 'f', 'g', 'h', 'a'],
  f: ['c', 'd', 'e', 'f', 'g', 'h', 'a', 'b'],
  g: ['d', 'e', 'f', 'g', 'h', 'a', 'b', 'c'],
  h: ['e', 'f', 'g', 'h', 'a', 'b', 'c', 'd'],
};

export const straightMatrix: TurnMatrix = {
  a: ['a', 'bh', 'cg', 'df', 'e'],
  b: ['b', 'ac', 'dh', 'eg', 'f'],
  c: ['c', 'bd', 'ae', 'fh', 'g'],
  d: ['d', 'ce', 'bf', 'ag', 'h'],
  e: ['e', 'df', 'cg', 'bh', 'a'],
  f: ['f', 'eg', 'dh', 'cg', 'b'],
  g: ['g', 'fh', 'ea', 'dh', 'c'],
  h: ['h', 'ag', 'bf', 'cg', 'd'],
};

export const moveMatrix: MoveMatrix = {
  0: {
    a: { x: +0, y: -1 },
    b: { x: +1, y: -1 },
    c: { x: +1, y: +0 },
    d: { x: +1, y: +1 },
    e: { x: +0, y: +1 },
    f: { x: -1, y: +1 },
    g: { x: -1, y: +0 },
    h: { x: -1, y: -1 },
  },
};

export const preferredMatrix: PreferredMatrix = {
  0: ['c', 'd', 'e'],
};

export const pathMatrix: PathMatrix = {
  a: 90,
  b: 45,
  c: 0,
  d: 315,
  e: 270,
  f: 225,
  g: 180,
  h: 135,
};
