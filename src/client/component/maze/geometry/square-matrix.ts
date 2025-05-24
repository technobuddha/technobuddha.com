/* eslint-disable @typescript-eslint/no-unnecessary-type-conversion */
import { type Matrix } from './maze.ts';

/*

{
  bridgePieces: 1,
  build: {
    0: {
      e: ['e'],
      s: ['s'],
      w: ['w'],
      n: ['n'],
    }
  }
}

*/

export const matrix: Matrix = {
  directions: ['n', 'e', 'w', 's'],
  pillars: ['ne', 'nw', 'se', 'sw'],
  wall: {
    0: { n: true, e: true, w: true, s: true },
  },
  opposite: {
    n: 's',
    e: 'w',
    w: 'e',
    s: 'n',
  },
  inverse: {
    n: 's',
    e: 'w',
    w: 'e',
    s: 'n',
  },
  rightTurn: {
    n: ['e', 'n', 'w', 's'],
    e: ['s', 'e', 'n', 'w'],
    w: ['n', 'w', 's', 'e'],
    s: ['w', 's', 'e', 'n'],
  },
  leftTurn: {
    n: ['w', 'n', 'e', 's'],
    e: ['n', 'e', 's', 'w'],
    w: ['s', 'w', 'n', 'e'],
    s: ['e', 's', 'w', 'n'],
  },
  straight: {
    n: ['n', 'ew', 's'],
    e: ['e', 'ns', 'w'],
    w: ['w', 'ns', 'e'],
    s: ['s', 'ew', 'n'],
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
  angle: { n: 90, s: 270, e: 0, w: 180 },
};
