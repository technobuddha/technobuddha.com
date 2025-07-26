/* eslint-disable @typescript-eslint/no-unnecessary-type-conversion */
import { type Matrix } from '../matrix.ts';

export const matrix: Matrix = {
  bridge: {
    pieces: 2,
    layouts: {
      0: [
        { path: ['b', 'a'], rear: ['e', 'd'] },
        { path: ['b', 'c'], rear: ['e', 'f'] },
        { path: ['d', 'c'], rear: ['a', 'f'] },
        { path: ['d', 'e'], rear: ['a', 'b'] },
        { path: ['f', 'a'], rear: ['c', 'd'] },
        { path: ['f', 'e'], rear: ['c', 'b'] },
      ],
      1: [
        { path: ['a', 'b'], rear: ['d', 'e'] },
        { path: ['a', 'f'], rear: ['d', 'c'] },
        { path: ['c', 'b'], rear: ['f', 'e'] },
        { path: ['c', 'd'], rear: ['f', 'a'] },
        { path: ['e', 'd'], rear: ['b', 'a'] },
        { path: ['e', 'f'], rear: ['b', 'c'] },
      ],
    },
    connect: { a: 'd', b: 'e', c: 'f', d: 'a', e: 'b', f: 'c' },
  },
  directions: ['a', 'b', 'c', 'd', 'e', 'f'],
  pillars: ['ac', 'ce', 'ea', 'bd', 'df', 'fb'],
  wall: {
    0: { b: true, d: true, f: true },
    1: { a: true, c: true, e: true },
  },
  opposite: {
    direction: {
      a: 'D',
      b: 'E',
      c: 'F',
      d: 'A',
      e: 'B',
      f: 'C',
    },
    facing: {
      A: 'd',
      B: 'e',
      C: 'f',
      D: 'a',
      E: 'b',
      F: 'c',
    },
  },
  rightTurn: {
    A: ['b', 'f', 'd'],
    B: ['c', 'a', 'e'],
    C: ['d', 'b', 'f'],
    D: ['e', 'c', 'a'],
    E: ['f', 'd', 'b'],
    F: ['a', 'e', 'c'],
  },
  leftTurn: {
    A: ['f', 'b', 'd'],
    B: ['a', 'c', 'e'],
    C: ['b', 'd', 'f'],
    D: ['c', 'e', 'a'],
    E: ['d', 'f', 'b'],
    F: ['e', 'a', 'c'],
  },
  straight: {
    A: ['bf', 'd'],
    B: ['ac', 'e'],
    C: ['bd', 'f'],
    D: ['ce', 'a'],
    E: ['df', 'b'],
    F: ['ea', 'c'],
  },
  move: {
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
  },
  preferred: {
    0: ['b', 'd'],
    1: ['c'],
  },
  angle: {
    a: 270,
    b: 330,
    c: 30,
    d: 90,
    e: 150,
    f: 210,
  },
};
