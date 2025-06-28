import { manhattanDistance } from '@technobuddha/library';

import { type Cell, type CellFacing, type Maze, type Move } from '../../geometry/maze.ts';
import { darken } from '../../library/darken.ts';
import { Random, type RandomProperties } from '../../random/random.ts';

export type Program = 'random' | 'seek' | 'left-turn' | 'right-turn' | 'straight';

export type RobotProperties = RandomProperties & {
  maze: Maze;
  color?: string;
  location: CellFacing;
  program?: Program;
  trails?: number;
  clearCell?: (cell: Cell) => void;
  name?: string;
};

export abstract class Robot extends Random implements Disposable {
  public readonly color: string;
  public location: CellFacing;
  public readonly program: Program;
  public readonly name: string;

  protected readonly trails: number;
  protected readonly trail: CellFacing[] = [];

  protected readonly start: CellFacing;
  protected readonly maze: Maze;
  protected readonly clearCell: (cell: Cell) => void;
  protected readonly history: CellFacing[];
  protected bias = true;

  public constructor({
    maze,
    location = maze.entrance,
    color = maze.avatarColor,
    trails = 12,
    program = 'random',
    random = maze.random,
    clearCell = (cell) => maze.drawCell(cell),
    name = `Robot#${random()}`,
    ...props
  }: RobotProperties) {
    super({ random, ...props });
    this.maze = maze;
    this.color = color;
    this.trails = trails;
    this.location = location;
    this.start = location;
    this.program = program;
    this.clearCell = clearCell;
    this.name = name;

    this.history = [location];
  }

  protected moveTo(next: CellFacing): void {
    this.location = next;

    this.clearCell(this.location);
    this.maze.drawAvatar(this.location, this.color);

    if (this.trails > 0) {
      while (this.trail.length > this.trails) {
        const cell = this.trail.pop()!;
        this.clearCell(cell);
      }

      for (let i = 0; i < this.trail.length; i++) {
        const cell = this.trail[i];
        this.clearCell(cell);
        this.maze.drawAvatar(cell, darken(this.color, (0.5 / this.trail.length) * (i + 1)));
      }

      this.trail.unshift(this.location);
    }

    this.history.push(this.location);
  }

  protected decide(moves: Move[], origin: CellFacing): Move | undefined {
    if (moves.length === 0) {
      return undefined;
    }

    switch (this.program) {
      case 'random': {
        return this.randomPick(moves)!;
      }

      case 'seek': {
        return moves.sort(
          (a, b) =>
            manhattanDistance({ x: a.move.x, y: a.move.y }, this.maze.exit) -
            manhattanDistance({ x: b.move.x, y: b.move.y }, this.maze.exit),
        )[0];
      }

      case 'left-turn': {
        for (const direction of this.maze.leftTurn(origin)) {
          const move = moves.find((m) => m.direction === direction);
          if (move) {
            return move;
          }
        }
        return undefined;
      }

      case 'right-turn': {
        for (const direction of this.maze.rightTurn(origin)) {
          const move = moves.find((m) => m.direction === direction);
          if (move) {
            return move;
          }
        }
        return undefined;
      }

      case 'straight': {
        this.bias = !this.bias;
        for (const direction of this.maze.straight(origin, this.bias)) {
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

  protected previousLocation(): CellFacing | undefined {
    return this.history.at(-2);
  }

  public path(): CellFacing[] {
    return this.maze.flatten(this.history);
  }

  //#region Disposable
  public dispose(): void {
    //
  }

  public [Symbol.dispose](): void {
    this.dispose();
  }
  //#endregion
}
