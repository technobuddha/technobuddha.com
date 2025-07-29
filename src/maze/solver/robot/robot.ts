import { modulo } from '@technobuddha/library';

import { type Cell, type CellFacing, type Maze, type Move } from '../../geometry/index.ts';
import { darken, PathSet } from '../../library/index.ts';
import { Random, MessageOptions, type RandomProperties } from '../../random/index.ts';

export type Program =
  | 'random'
  | 'seek'
  | 'straight'
  | 'left-turn'
  | 'right-turn'
  | 'right-wall'
  | 'left-wall';

export type RobotProperties = RandomProperties & {
  maze: Maze;
  color?: string;
  location: CellFacing;
  program?: Program;
  trails?: number;
  showPath?: boolean;
  drawCell?: (cell: Cell, color?: string) => void;
};

export abstract class Robot extends Random implements Disposable {
  public readonly color: string;
  public location: CellFacing;
  public program: Program;

  protected previous: CellFacing;
  protected readonly history: CellFacing[];
  protected readonly trails: number;
  protected readonly trail: CellFacing[] = [];
  protected readonly showPath: boolean;
  protected readonly start: CellFacing;
  protected readonly maze: Maze;
  protected drawCell: (cell: Cell, color?: string) => void;
  protected avatar: (cell: Cell, color: string) => void;
  protected bias = true;
  protected pathSet = new PathSet();

  private seekingWall = true;

  public constructor({
    maze,
    location = maze.entrance,
    color = maze.color.avatar,
    trails = 0,
    showPath = false,
    program = 'random',
    random = maze.random,
    drawCell = (cell, color) => maze.drawCell(cell, color),
    ...props
  }: RobotProperties) {
    super({ random, ...props });
    this.maze = maze;

    this.program = program;

    this.color = color;
    this.trails = trails;
    this.showPath = showPath;
    this.drawCell = drawCell;

    this.location = location;
    this.previous = location;
    this.start = location;
    this.history = [location];

    this.avatar = (cell, color) => this.maze.drawAvatar(cell, color);
  }

  public abstract algorithm: string;

  public get name(): string {
    return `${this.algorithm} ${this.program}`;
  }

  protected redrawCell(cell: Cell, color?: string): void {
    this.drawCell(cell, color);

    const index = this.trail.findIndex((c) => this.maze.isSame(c, cell));
    if (index > 0) {
      this.avatar(cell, darken(this.color, (0.5 / this.trail.length) * (index + 1)));
      this.maze.drawDot(cell, this.maze.color.cell);
    }
  }

  protected drawPath(): void {
    if (this.showPath) {
      const currentPathSet = new PathSet(this.maze.makePath(this.path()));

      for (const path of this.pathSet.difference(currentPathSet)) {
        this.drawCell(path);
      }

      for (const path of currentPathSet.difference(this.pathSet)) {
        this.maze.drawPath(path);
      }
      this.pathSet = currentPathSet;
    }
  }

  protected drawTrails(): void {
    if (this.trails > 0) {
      while (this.trail.length > this.trails) {
        const cell = this.trail.pop()!;
        this.redrawCell(cell);
      }

      for (let i = this.trail.length - 1; i >= 0; i--) {
        const cell = this.trail[i];
        this.redrawCell(cell);
        this.avatar(cell, darken(this.color, (0.5 / this.trail.length) * (i + 1)));
        this.maze.drawDot(cell, this.maze.color.cell);
      }

      this.trail.unshift(this.location);
    }
  }

  protected moveTo(next: CellFacing): void {
    this.redrawCell(this.location);

    this.history.push({ ...this.location });
    this.previous = this.location;
    this.location = next;

    this.drawPath();
    this.drawTrails();
    this.redrawCell(this.location);
    this.avatar(this.location, this.color);
  }

  protected backtrack(): void {
    this.redrawCell(this.location);

    this.history.pop();
    this.location = this.previous;
    this.previous = this.history.at(-1) ?? this.start;

    this.drawPath();
    this.drawTrails();
    this.redrawCell(this.location);
    this.avatar(this.location, this.color);
  }

  protected decide(moves: Move[]): Move | undefined {
    if (moves.length === 0) {
      return undefined;
    }

    switch (this.program) {
      case 'random': {
        return this.randomPick(moves);
      }

      case 'seek': {
        const closest = moves
          .map((m) => ({
            move: m,
            distance: this.maze.manhattanDistance(m.target, this.maze.exit),
          }))
          .sort((a, b) => a.distance - b.distance);

        return this.randomPick(closest.filter((c) => c.distance === closest[0].distance))!.move;
      }

      case 'left-turn': {
        for (const direction of this.maze.leftTurn(this.location)) {
          const move = moves.find((m) => m.direction === direction);
          if (move) {
            return move;
          }
        }
        return undefined;
      }

      case 'right-turn': {
        for (const direction of this.maze.rightTurn(this.location)) {
          const move = moves.find((m) => m.direction === direction);
          if (move) {
            return move;
          }
        }
        return undefined;
      }

      case 'right-wall': {
        const right = this.maze.rightTurn(this.location);
        const { walls } = this.maze.nexus(this.location);

        if (this.seekingWall) {
          const wall = right.findIndex((t) => walls[t] === true);
          if (wall >= 0) {
            // We are seeking a wall, and we found one
            this.seekingWall = false;

            const dirs = new Set(moves.map((m) => m.direction));
            let next = wall;
            while (!dirs.has(right[next])) {
              next = modulo(next + 1, right.length);
              if (next === wall) {
                // We have gone all the way around, so we will just pick the first
                return undefined;
              }
            }

            return moves.find((m) => m.direction === right[next]);
          }

          this.bias = !this.bias;
          const [first] = this.maze.straight(this.location, this.bias);
          return moves.find((m) => m.direction === first);
        }

        const [first] = right.map((t) => moves.find((m) => m.direction === t)).filter(Boolean);
        return first;
      }

      case 'left-wall': {
        const left = this.maze.leftTurn(this.location);
        const { walls } = this.maze.nexus(this.location);

        if (this.seekingWall) {
          const wall = left.findIndex((t) => walls[t] === true);
          if (wall >= 0) {
            // We are seeking a wall, and we found one
            this.seekingWall = false;

            const dirs = new Set(moves.map((m) => m.direction));
            let next = wall;
            while (!dirs.has(left[next])) {
              next = modulo(next + 1, left.length);
              if (next === wall) {
                // We have gone all the way around, so we will just pick the first
                return undefined;
              }
            }

            return moves.find((m) => m.direction === left[next]);
          }

          this.bias = !this.bias;
          const [first] = this.maze.straight(this.location, this.bias);
          return moves.find((m) => m.direction === first);
        }

        const [first] = left.map((t) => moves.find((m) => m.direction === t)).filter(Boolean);
        return first;
      }

      case 'straight': {
        this.bias = !this.bias;
        for (const direction of this.maze.straight(this.location, this.bias)) {
          const move = moves.find((m) => m.direction === direction);
          if (move) {
            return move;
          }
        }
        return undefined;
      }

      default: {
        return moves[0];
      }
    }
  }

  public abstract execute(): void;

  public sendMessage(message: string, { color }: MessageOptions = {}): void {
    this.maze.sendMessage(message, { color });
  }

  public path(): CellFacing[] {
    return [...this.history, this.location];
  }

  //#region Disposable
  public dispose(): void {
    if (this.trails > 0) {
      for (const cell of this.trail) {
        this.redrawCell(cell);
      }
    } else {
      this.redrawCell(this.location);
    }
  }

  public [Symbol.dispose](): void {
    this.dispose();
  }
  //#endregion
}
