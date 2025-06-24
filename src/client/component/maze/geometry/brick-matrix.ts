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
    a: ['a', 'b', 'f', 'c', 'd', 'e'],
    b: ['b', 'a', 'c', 'f', 'e', 'd'],
    c: ['c', 'b', 'd', 'e', 'a', 'f'],
    d: ['d', 'e', 'c', 'f', 'a', 'b'],
    e: ['e', 'd', 'f', 'c', 'd', 'a'],
    f: ['f', 'a', 'e', 'd', 'b', 'c'],
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
