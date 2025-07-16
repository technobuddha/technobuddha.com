import { type BridgeLayout } from './bridges.ts';
import {
  type Direction,
  type Facing,
  type Kind,
  type MoveOffset,
  type Pillar,
} from './geometry.ts';

export type BridgeMatrix = {
  readonly pieces?: number;
  readonly connect: Partial<Record<Direction, Direction>>;
  readonly layouts: Record<Kind, BridgeLayout[]>;
};

export type Matrix = {
  readonly directions: Direction[];
  readonly pillars: Pillar[];
  readonly wall: Record<Kind, Partial<Record<Direction, boolean>>>;
  readonly opposite: {
    readonly direction: Partial<Record<Direction, Facing>>;
    readonly facing: Partial<Record<Facing, Direction>>;
  };
  readonly rightTurn: Partial<Record<Facing, Direction[]>>;
  readonly leftTurn: Partial<Record<Facing, Direction[]>>;
  readonly straight: Partial<Record<Facing, (Direction | `${Direction}${Direction}`)[]>>;
  readonly move: Record<Kind, Partial<Record<Direction, MoveOffset | MoveOffset[]>>>;
  readonly preferred: Record<Kind, Direction[]>;
  readonly angle: Partial<Record<Direction, number>>;
  readonly bridge?: BridgeMatrix;
};
