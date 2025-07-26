import { type Rect } from '@technobuddha/library';

import { type CellFacing, type Direction } from './geometry.ts';

type Directional<T> = Partial<Record<Direction, T | false | undefined>>;
export type Wall = Directional<true>;
export type Tunnels = Directional<CellFacing>;
export type Via = Directional<CellFacing[]>;

export type Offsets = Record<string, number>;

export type NexusProperties = {
  x: number;
  y: number;
  walls: Wall;
  tunnels: Tunnels;
  via: Via;
  barriers: Wall;
  mask?: boolean;
  distance?: number;
  rect: Rect;
};

export class Nexus {
  public readonly x: number;
  public readonly y: number;
  public readonly walls: Wall;
  public readonly tunnels: Tunnels;
  public readonly via: Via;
  public readonly barriers: Wall;
  public bridge: number | undefined;
  public elevated = false;
  public mask: boolean;
  public distance: number;
  public rect: Rect;

  public constructor({
    x,
    y,
    walls,
    tunnels,
    via,
    barriers,
    mask = false,
    distance = Infinity,
    rect,
  }: NexusProperties) {
    this.x = x;
    this.y = y;
    this.walls = walls;
    this.tunnels = tunnels;
    this.via = via;
    this.barriers = barriers;
    this.mask = mask;
    this.distance = distance;
    this.rect = rect;
  }

  public wallDirections(): Direction[] {
    return Object.keys(this.walls) as Direction[];
  }

  public tunnelDirections(): Direction[] {
    return Object.keys(this.tunnels) as Direction[];
  }

  public viaDirections(): Direction[] {
    return Object.keys(this.via) as Direction[];
  }

  public hasWall(direction: Direction): boolean {
    return direction in this.walls;
  }

  public addWall(direction: Direction): void {
    if (direction in this.walls) {
      this.walls[direction] = true;
    } else {
      throw new Error(`Invalid wall: ${direction}`);
    }
  }

  public removeWall(direction: Direction): void {
    if (direction in this.walls) {
      this.walls[direction] = false;
    } else {
      throw new Error(`Invalid wall: ${direction}`);
    }
  }

  public erectBarrier(direction: Direction): void {
    if (direction in this.walls) {
      delete this.walls[direction];
    }
    this.barriers[direction] = true;
  }
}
