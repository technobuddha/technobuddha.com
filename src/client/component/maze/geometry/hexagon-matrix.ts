/* eslint-disable @typescript-eslint/no-unnecessary-type-conversion */
import { type Matrix } from './maze.ts';

const bridge = {
  bridgePieces: 1,
  build: {
    0: {
      a: [['a']],
      b: [['b'], ['b', 'c']],
      c: [['c'], ['c', 'b']],
      d: [['d']],
      e: [['e'], ['e', 'f']],
      f: [['f'], ['f', 'e']],
    },
    // 1: {
    //   b: [
    //     ['b', 'a'],
    //     ['b', 'c'],
    //   ],
    //   d: [
    //     ['d', 'c'],
    //     ['d', 'e'],
    //   ],
    //   f: [
    //     ['f', 'a'],
    //     ['f', 'e'],
    //   ],
    // },
  },
};

export const matrix: Matrix = {
  directions: ['a', 'b', 'c', 'd', 'e', 'f'],
  pillars: ['ab', 'bc', 'cd', 'de', 'ef', 'fa'],
  wall: {
    0: { a: true, b: true, c: true, d: true, e: true, f: true },
    1: { a: true, b: true, c: true, d: true, e: true, f: true },
  },
  opposite: {
    a: 'd',
    b: 'e',
    c: 'f',
    d: 'a',
    e: 'b',
    f: 'c',
  },
  inverse: {
    a: 'd',
    b: 'e',
    c: 'f',
    d: 'a',
    e: 'b',
    f: 'c',
  },
  rightTurn: {
    a: ['c', 'b', 'a', 'f', 'e', 'd'],
    b: ['d', 'c', 'b', 'a', 'f', 'e'],
    c: ['e', 'd', 'c', 'b', 'a', 'f'],
    d: ['f', 'e', 'd', 'c', 'b', 'a'],
    e: ['a', 'f', 'e', 'd', 'c', 'b'],
    f: ['b', 'a', 'f', 'e', 'd', 'c'],
  },
  leftTurn: {
    a: ['e', 'f', 'a', 'b', 'c', 'd'],
    b: ['f', 'a', 'b', 'c', 'd', 'e'],
    c: ['a', 'b', 'c', 'd', 'e', 'f'],
    d: ['b', 'c', 'd', 'e', 'f', 'a'],
    e: ['c', 'd', 'e', 'f', 'a', 'b'],
    f: ['d', 'e', 'f', 'a', 'b', 'c'],
  },
  straight: {
    a: ['a', 'bf', 'ce', 'd'],
    b: ['b', 'ac', 'df', 'e'],
    c: ['c', 'bd', 'ae', 'f'],
    d: ['d', 'ce', 'bf', 'a'],
    e: ['e', 'df', 'ac', 'b'],
    f: ['f', 'ae', 'bd', 'c'],
  },
  move: {
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
  },
  preferred: {
    0: ['b', 'c', 'd'],
    1: ['b', 'c', 'd'],
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
