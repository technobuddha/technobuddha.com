/* eslint-disable @typescript-eslint/no-unnecessary-type-conversion */
import { type Matrix } from './maze.ts';

export const matrix: Matrix = {
  bridge: {
    pieces: 2,
    layouts: {
      0: [
        // { path: ['b', 'a'] },
        // { path: ['b', 'c'] },
        { path: ['d', 'c'] },
        { path: ['d', 'e'] },
        { path: ['f', 'a'] },
        { path: ['f', 'e'] },
      ],
      1: [
        { path: ['a', 'b'] },
        { path: ['a', 'f'] },
        { path: ['c', 'b'] },
        // { path: ['c', 'd'] },
        // { path: ['e', 'd'] },
        { path: ['e', 'f'] },
      ],
    },
  },
  directions: ['a', 'b', 'c', 'd', 'e', 'f'],
  pillars: ['ac', 'ce', 'ea', 'bd', 'df', 'fb'],
  wall: {
    0: { b: true, d: true, f: true },
    1: { a: true, c: true, e: true },
  },
  opposite: {
    a: 'd',
    b: 'e',
    c: 'f',
    d: 'a',
    e: 'b',
    f: 'c',
  },
  rightTurn: {
    a: ['b', 'f', 'd'],
    b: ['c', 'a', 'e'],
    c: ['d', 'b', 'f'],
    d: ['e', 'c', 'a'],
    e: ['f', 'd', 'b'],
    f: ['a', 'e', 'c'],
  },
  leftTurn: {
    a: ['f', 'b', 'd'],
    b: ['a', 'c', 'e'],
    c: ['b', 'd', 'f'],
    d: ['c', 'e', 'a'],
    e: ['d', 'f', 'b'],
    f: ['e', 'a', 'c'],
  },
  straight: {
    a: ['bf', 'd'],
    b: ['ac', 'e'],
    c: ['bd', 'f'],
    d: ['ce', 'a'],
    e: ['df', 'b'],
    f: ['ea', 'c'],
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
    a: 90,
    b: 30,
    c: 330,
    d: 270,
    e: 210,
    f: 150,
  },
};
