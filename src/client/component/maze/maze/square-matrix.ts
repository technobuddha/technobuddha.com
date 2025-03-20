import { type Corner, type Direction, type XY } from './maze.js';

export const directionMatrix: Direction[] = ['n', 'e', 'w', 's'];
export const cornerMatrix: Corner[] = ['ne', 'nw', 'se', 'sw'];

export const wallMatrix: Record<Direction, boolean> = { n: true, e: true, w: true, s: true };

export const oppositeMatrix: Record<Direction, Direction> = {
  n: 's',
  e: 'w',
  w: 'e',
  s: 'n',
};

export const rightTurnMatrix: Record<Direction, Direction[]> = {
  n: ['e', 'n', 'w', 's'],
  e: ['s', 'e', 'n', 'w'],
  w: ['n', 'w', 's', 'e'],
  s: ['w', 's', 'e', 'n'],
};

export const leftTurnMatrix: Record<Direction, Direction[]> = {
  n: ['w', 'n', 'e', 's'],
  e: ['n', 'e', 's', 'w'],
  w: ['s', 'w', 'n', 'e'],
  s: ['e', 's', 'w', 'n'],
};

export const moveMatrix: Record<Direction, XY> = {
  n: { x: +0, y: -1 },
  e: { x: +1, y: +0 },
  w: { x: -1, y: +0 },
  s: { x: +0, y: +1 },
};
