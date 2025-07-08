import { type Rect } from '@technobuddha/library';

import { type Direction, type Tunnels, type Wall } from './maze.ts';

export type Offsets = Record<string, number>;

export type NexusProperties = {
  x: number;
  y: number;
  walls: Wall;
  tunnels: Tunnels;
  bridge?: boolean;
  mask?: boolean;
  distance?: number;
  rect: Rect;
};

export class Nexus {
  public readonly x: number;
  public readonly y: number;
  public readonly walls: Wall;
  public readonly tunnels: Tunnels;
  public bridge: boolean;
  public mask: boolean;
  public distance: number;
  public rect: Rect;

  public constructor({
    x,
    y,
    walls,
    tunnels,
    bridge = false,
    mask = false,
    distance = Infinity,
    rect,
  }: NexusProperties) {
    this.x = x;
    this.y = y;
    this.walls = walls;
    this.tunnels = tunnels;
    this.bridge = bridge;
    this.mask = mask;
    this.distance = distance;
    this.rect = rect;
  }

  public get wallDirections(): Direction[] {
    return Object.keys(this.walls) as Direction[];
  }

  public get tunnelDirections(): Direction[] {
    return Object.keys(this.tunnels) as Direction[];
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
}
