import { type Direction } from './geometry.ts';

export type Bridge = {
  readonly pieces: number;
  readonly direction: Direction;
  readonly path: Direction[];
  readonly connect: Partial<Record<Direction, Direction>>;
};

export type BridgeLayout = {
  path: Direction[];
  pieces?: number;
  connect?: Partial<Record<Direction, Direction>>;
};
