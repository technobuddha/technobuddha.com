import { manhattanDistance } from '@technobuddha/library';

import { type Cell, type CellFacing, type Maze, type Move } from '../../geometry/index.ts';
import { darken, PathSet } from '../../library/index.ts';
import { Random, type RandomProperties } from '../../random/index.ts';

export type Program = 'random' | 'seek' | 'left-turn' | 'right-turn' | 'straight';

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

      for (let i = 0; i < this.trail.length; i++) {
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

    this.redrawCell(this.location);
    this.avatar(this.location, this.color);
    this.drawPath();
    this.drawTrails();
  }

  protected backtrack(): void {
    this.redrawCell(this.location);

    this.history.pop();
    this.location = this.previous;
    this.previous = this.history.at(-1) ?? this.start;

    this.redrawCell(this.location);
    this.avatar(this.location, this.color);
    this.drawPath();
    this.drawTrails();
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
        return moves.sort(
          (a, b) =>
            manhattanDistance({ x: a.target.x, y: a.target.y }, this.maze.exit) -
            manhattanDistance({ x: b.target.x, y: b.target.y }, this.maze.exit),
        )[0];
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

  public override sendMessage(message: string, color?: string): void {
    this.maze.sendMessage(message, color);
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
