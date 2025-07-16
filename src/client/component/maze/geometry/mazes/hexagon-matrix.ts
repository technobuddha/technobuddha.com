/* eslint-disable @typescript-eslint/no-unnecessary-type-conversion */
import { type Matrix } from '../matrix.ts';

export const matrix: Matrix = {
  bridge: {
    pieces: 1,
    layouts: {
      0: [
        { path: ['a'] },
        { path: ['b'] },
        { path: ['c'] },
        { path: ['d'] },
        { path: ['e'] },
        { path: ['f'] },
      ],
      1: [
        { path: ['a'] },
        { path: ['b'] },
        { path: ['c'] },
        { path: ['d'] },
        { path: ['e'] },
        { path: ['f'] },
      ],
    },
    connect: { a: 'd', b: 'e', c: 'f', d: 'a', e: 'b', f: 'c' },
  },
  directions: ['a', 'b', 'c', 'd', 'e', 'f'],
  pillars: ['ab', 'bc', 'cd', 'de', 'ef', 'fa'],
  wall: {
    0: { a: true, b: true, c: true, d: true, e: true, f: true },
    1: { a: true, b: true, c: true, d: true, e: true, f: true },
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
    A: ['c', 'b', 'a', 'f', 'e', 'd'],
    B: ['d', 'c', 'b', 'a', 'f', 'e'],
    C: ['e', 'd', 'c', 'b', 'a', 'f'],
    D: ['f', 'e', 'd', 'c', 'b', 'a'],
    E: ['a', 'f', 'e', 'd', 'c', 'b'],
    F: ['b', 'a', 'f', 'e', 'd', 'c'],
  },
  leftTurn: {
    A: ['e', 'f', 'a', 'b', 'c', 'd'],
    B: ['f', 'a', 'b', 'c', 'd', 'e'],
    C: ['a', 'b', 'c', 'd', 'e', 'f'],
    D: ['b', 'c', 'd', 'e', 'f', 'a'],
    E: ['c', 'd', 'e', 'f', 'a', 'b'],
    F: ['d', 'e', 'f', 'a', 'b', 'c'],
  },
  straight: {
    A: ['a', 'bf', 'ce', 'd'],
    B: ['b', 'ac', 'df', 'e'],
    C: ['c', 'bd', 'ae', 'f'],
    D: ['d', 'ce', 'bf', 'a'],
    E: ['e', 'df', 'ac', 'b'],
    F: ['f', 'ae', 'bd', 'c'],
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
    a: 270,
    b: 330,
    c: 30,
    d: 90,
    e: 150,
    f: 210,
  },
};
