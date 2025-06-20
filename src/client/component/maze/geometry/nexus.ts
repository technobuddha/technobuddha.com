import { type Portal, type Wall } from './maze.ts';

export type NexusProperties = {
  x: number;
  y: number;
  walls: Wall;
  tunnels: Portal;
  bridge?: boolean;
  mask?: boolean;
  distance?: number;
};

export class Nexus {
  public readonly x: number;
  public readonly y: number;
  public readonly walls: Wall;
  public readonly tunnels: Portal;
  public bridge: boolean;
  public mask: boolean;
  public distance: number;

  public constructor({
    x,
    y,
    walls,
    tunnels,
    bridge = false,
    mask = false,
    distance = Infinity,
  }: NexusProperties) {
    this.x = x;
    this.y = y;
    this.walls = walls;
    this.tunnels = tunnels;
    this.bridge = bridge;
    this.mask = mask;
    this.distance = distance;
  }
}
