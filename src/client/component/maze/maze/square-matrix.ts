import {
  type DirectionMatrix,
  type EdgesMatrix,
  type MoveMatrix,
  type OppositeMatrix,
  type PathMatrix,
  type PillarMatrix,
  type TurnMatrix,
  type WallMatrix,
} from './maze.ts';

export const directionMatrix: DirectionMatrix = ['n', 'e', 'w', 's'];
export const pillarMatrix: PillarMatrix = ['ne', 'nw', 'se', 'sw'];

export const wallMatrix: WallMatrix = {
  0: { n: true, e: true, w: true, s: true },
};

export const oppositeMatrix: OppositeMatrix = {
  n: 's',
  e: 'w',
  w: 'e',
  s: 'n',
};

export const rightTurnMatrix: TurnMatrix = {
  n: ['e', 'n', 'w', 's'],
  e: ['s', 'e', 'n', 'w'],
  w: ['n', 'w', 's', 'e'],
  s: ['w', 's', 'e', 'n'],
};

export const leftTurnMatrix: TurnMatrix = {
  n: ['w', 'n', 'e', 's'],
  e: ['n', 'e', 's', 'w'],
  w: ['s', 'w', 'n', 'e'],
  s: ['e', 's', 'w', 'n'],
};

export const straightMatrix: TurnMatrix = {
  n: ['n', 'ew', 's'],
  e: ['e', 'ns', 'w'],
  w: ['w', 'ns', 'e'],
  s: ['s', 'ew', 'n'],
};

export const moveMatrix: MoveMatrix = {
  0: {
    n: { x: +0, y: -1 },
    e: { x: +1, y: +0 },
    w: { x: -1, y: +0 },
    s: { x: +0, y: +1 },
  },
};

export const edgesMatrix: EdgesMatrix = {
  0: ['s', 'w'],
};

export const pathMatrix: PathMatrix = { n: 90, s: 270, e: 0, w: 180 };
