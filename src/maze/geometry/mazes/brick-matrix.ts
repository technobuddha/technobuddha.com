/* eslint-disable @typescript-eslint/no-unnecessary-type-conversion */
import { type Matrix } from '../matrix.ts';

export const matrix: Matrix = {
  bridge: {
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
        { path: ['a', 'b'], rear: ['e', 'd'], connect: { c: 'f', f: 'c' } },
        { path: ['b', 'a'], rear: ['d', 'e'], connect: { c: 'f', f: 'c' } },
        { path: ['d', 'e'], rear: ['b', 'a'], connect: { c: 'f', f: 'c' } },
        { path: ['e', 'd'], rear: ['a', 'b'], connect: { c: 'f', f: 'c' } },
        { path: ['c'], rear: ['f'], connect: { a: 'e', e: 'a', b: 'd', d: 'b' } },
        { path: ['f'], rear: ['c'], connect: { a: 'e', e: 'a', b: 'd', d: 'b' } },
      ],
      1: [
        { path: ['a', 'b'], rear: ['e', 'd'], connect: { c: 'f', f: 'c' } },
        { path: ['b', 'a'], rear: ['d', 'e'], connect: { c: 'f', f: 'c' } },
        { path: ['d', 'e'], rear: ['b', 'a'], connect: { c: 'f', f: 'c' } },
        { path: ['e', 'd'], rear: ['a', 'b'], connect: { c: 'f', f: 'c' } },
        { path: ['c'], rear: ['f'], connect: { a: 'e', e: 'a', b: 'd', d: 'b' } },
        { path: ['f'], rear: ['c'], connect: { a: 'e', e: 'a', b: 'd', d: 'b' } },
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
    A: ['b', 'a', 'c', 'f', 'e', 'd'],
    B: ['a', 'b', 'f', 'c', 'd', 'e'],
    C: ['c', 'ea', 'bd', 'f'],
    D: ['e', 'd', 'f', 'c', 'b', 'a'],
    E: ['d', 'e', 'c', 'f', 'a', 'b'],
    F: ['f', 'bd', 'ae', 'c'],
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
