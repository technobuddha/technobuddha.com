import { type Portal, type Wall } from './maze.ts';

export class Nexus {
  public readonly x: number;
  public readonly y: number;
  public readonly walls: Wall;
  public readonly portals: Portal;
  public bridge: boolean;
  public mask: boolean;
  public distance: number;
  public destination = false;

  public constructor({
    x,
    y,
    walls,
    portals,
    bridge = false,
    mask = false,
    distance = Infinity,
  }: {
    x: number;
    y: number;
    walls: Wall;
    portals: Portal;
    bridge?: boolean;
    mask?: boolean;
    distance?: number;
  }) {
    this.x = x;
    this.y = y;
    this.walls = walls;
    this.portals = portals;
    this.bridge = bridge;
    this.mask = mask;
    this.distance = distance;
  }
}
