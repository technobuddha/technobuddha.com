/* eslint-disable @typescript-eslint/no-unnecessary-type-conversion */
import { type Matrix } from './maze.ts';

export const matrix: Matrix = {
  bridge: {
    pieces: 1,
    connect: {
      a: 'e',
      b: 'd',
      c: 'f',
      d: 'b',
      e: 'a',
      f: 'c',
    },
    layouts: {
      0: [
        { path: ['a', 'b'] },
        { path: ['b', 'a'] },
        { path: ['c'] },
        { path: ['d', 'e'] },
        { path: ['e', 'd'] },
        { path: ['f'] },
      ],
      1: [
        { path: ['a', 'b'] },
        { path: ['b', 'a'] },
        { path: ['c'] },
        { path: ['d', 'e'] },
        { path: ['e', 'd'] },
        { path: ['f'] },
      ],
    },
  },
  directions: ['a', 'b', 'c', 'd', 'e', 'f'],
  pillars: ['fa', 'ab', 'bc', 'cd', 'de', 'ef'],
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
    A: ['a', 'b', 'f', 'c', 'd', 'e'],
    B: ['b', 'a', 'c', 'f', 'e', 'd'],
    C: ['c', 'b', 'd', 'e', 'a', 'f'],
    D: ['d', 'e', 'c', 'f', 'a', 'b'],
    E: ['e', 'd', 'f', 'c', 'd', 'a'],
    F: ['f', 'a', 'e', 'd', 'b', 'c'],
  },
  move: {
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
  },
  preferred: {
    0: ['e', 'd', 'c'],
    1: ['e', 'd', 'c'],
  },
  angle: {
    a: 225,
    b: 315,
    c: 0,
    d: 45,
    e: 135,
    f: 180,
  },
};
