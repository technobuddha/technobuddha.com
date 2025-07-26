/* eslint-disable @typescript-eslint/no-unnecessary-type-conversion */
import { type Matrix } from '../matrix.ts';

export const matrix: Matrix = {
  bridge: {
    pieces: 1,
    layouts: {
      0: [
        { path: ['n'], rear: ['s'] },
        { path: ['e'], rear: ['w'] },
        { path: ['w'], rear: ['e'] },
        { path: ['s'], rear: ['n'] },
      ],
    },
    connect: { n: 's', e: 'w', w: 'e', s: 'n' },
  },
  directions: ['n', 'e', 'w', 's'],
  pillars: ['ne', 'nw', 'se', 'sw'],
  wall: {
    0: { n: true, e: true, w: true, s: true },
  },
  opposite: {
    direction: {
      n: 'S',
      e: 'W',
      w: 'E',
      s: 'N',
    },
    facing: {
      N: 's',
      E: 'w',
      W: 'e',
      S: 'n',
    },
  },
  rightTurn: {
    N: ['e', 'n', 'w', 's'],
    E: ['s', 'e', 'n', 'w'],
    W: ['n', 'w', 's', 'e'],
    S: ['w', 's', 'e', 'n'],
  },
  leftTurn: {
    N: ['w', 'n', 'e', 's'],
    E: ['n', 'e', 's', 'w'],
    W: ['s', 'w', 'n', 'e'],
    S: ['e', 's', 'w', 'n'],
  },
  straight: {
    N: ['n', 'ew', 's'],
    E: ['e', 'ns', 'w'],
    W: ['w', 'ns', 'e'],
    S: ['s', 'ew', 'n'],
  },
  move: {
    0: {
      n: { x: +0, y: -1 },
      e: { x: +1, y: +0 },
      w: { x: -1, y: +0 },
      s: { x: +0, y: +1 },
    },
  },
  preferred: {
    0: ['s', 'w'],
  },
  angle: { n: 270, s: 90, e: 0, w: 180 },
};
